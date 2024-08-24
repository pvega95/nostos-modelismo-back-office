import {
    Component,
    OnInit,
    EventEmitter,
    Output,
    Input,
    ViewChild,
    ContentChildren,
    QueryList,
    HostBinding,
    HostListener,
    Self,
    ElementRef,
} from '@angular/core';
import {
    NgxDropzoneService,
    FileSelectResult,
    RejectedFile,
} from '../ngx-dropzone.service';
import { coerceBooleanProperty, coerceNumberProperty } from '../helpers';
import { NgxDropzonePreviewComponent } from '../ngx-dropzone-preview/ngx-dropzone-preview.component';
import { DomSanitizer } from '@angular/platform-browser';

export interface NgxDropzoneChangeEvent {
    source: NgxDropzoneComponent;
    addedFiles: File[];
    rejectedFiles: RejectedFile[];
    contImagesDenied: number;
    ratio: string[];
}
export interface ImageDimension {
    width: number;
    height: number;
}

const ARRASTRE = 1;
const EXPLORADOR = 2;

@Component({
    selector: 'ngx-dropzone, [ngx-dropzone]',
    templateUrl: './ngx-dropzone.component.html',
    styleUrls: ['./ngx-dropzone.component.scss'],
    providers: [NgxDropzoneService],
})
export class NgxDropzoneComponent {
    public contImagesDenied: number = 0;

    constructor(
        @Self() private service: NgxDropzoneService
    ) {}

    /** A list of the content-projected preview children. */
    @ContentChildren(NgxDropzonePreviewComponent, { descendants: true })
    _previewChildren: QueryList<NgxDropzonePreviewComponent>;

    get _hasPreviews(): boolean {
        return !!this._previewChildren.length;
    }

    /** A template reference to the native file input element. */
    @ViewChild('fileInput', { static: true }) _fileInput: ElementRef;

    /** Emitted when any files were added or rejected. */
    @Output() readonly change = new EventEmitter<NgxDropzoneChangeEvent>();

    /** Set the accepted file types. Defaults to '*'. */
    @Input() accept = '*';
    @Input() ratio: string[];
    @Input() applyRatio: boolean;

    /** Disable any user interaction with the component. */
    @Input()
    @HostBinding('class.ngx-dz-disabled')
    get disabled(): boolean {
        return this._disabled;
    }
    set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);

        if (this._isHovered) {
            this._isHovered = false;
        }
    }
    private _disabled = false;

    /** Allow the selection of multiple files. */
    @Input()
    get multiple(): boolean {
        return this._multiple;
    }
    set multiple(value: boolean) {
        this._multiple = coerceBooleanProperty(value);
    }
    private _multiple = true;

    /** Set the maximum size a single file may have. */
    @Input()
    get maxFileSize(): number {
        return this._maxFileSize;
    }
    set maxFileSize(value: number) {
        this._maxFileSize = coerceNumberProperty(value);
    }
    private _maxFileSize: number = undefined;

    /** Allow the dropzone container to expand vertically. */
    @Input()
    @HostBinding('class.expandable')
    get expandable(): boolean {
        return this._expandable;
    }
    set expandable(value: boolean) {
        this._expandable = coerceBooleanProperty(value);
    }
    private _expandable: boolean = false;

    /** Open the file selector on click. */
    @Input()
    @HostBinding('class.unclickable')
    get disableClick(): boolean {
        return this._disableClick;
    }
    set disableClick(value: boolean) {
        this._disableClick = coerceBooleanProperty(value);
    }
    private _disableClick = false;

    /** Expose the id, aria-label, aria-labelledby and aria-describedby of the native file input for proper accessibility. */
    @Input() id: string;
    @Input('aria-label') ariaLabel: string;
    @Input('aria-labelledby') ariaLabelledby: string;
    @Input('aria-describedby') ariaDescribedBy: string;

    @HostBinding('class.ngx-dz-hovered')
    _isHovered = false;

    /** Show the native OS file explorer to select files. */
    @HostListener('click')
    _onClick() {
        if (!this.disableClick) {
            this.showFileSelector();
        }
    }

    @HostListener('dragover', ['$event'])
    _onDragOver(event) {
        if (this.disabled) {
            return;
        }

        this.preventDefault(event);
        this._isHovered = true;
    }

    @HostListener('dragleave')
    _onDragLeave() {
        this._isHovered = false;
    }

    @HostListener('drop', ['$event'])
    _onDrop(event) {
        if (this.disabled) {
            return;
        }

        this.preventDefault(event);
        this._isHovered = false;

        let filesInput: FileList = event.dataTransfer.files;
        this.sacarTamano(event, ARRASTRE).then((rs) => {
            let filesAllowed: FileList;
            filesAllowed = this.VerificarRatioImagenes(
                filesInput,
                this.ratio,
                this.applyRatio,
                rs.val
            ).files;
            this.handleFileDrop(filesAllowed);
        });
    }

    showFileSelector() {
        if (!this.disabled) {
            (this._fileInput.nativeElement as HTMLInputElement).click();
        }
    }

    _onFilesSelected(event) {
        if (this.accept === '*') {
            let files = event.target.files;
            this.handleFileDrop(files);
            this.preventDefault(event);
            return;
        }

        this.sacarTamano(event, EXPLORADOR).then((rs) => {
            let filesInput: FileList = rs.event.target.files;
            let filesAllowed: FileList;
            filesAllowed = this.VerificarRatioImagenes(
                filesInput,
                this.ratio,
                this.applyRatio,
                rs.val
            ).files;
            this.handleFileDrop(filesAllowed);
            // Reset the native file input element to allow selecting the same file again
            this._fileInput.nativeElement.value = '';
        });

        // fix(#32): Prevent the default event behaviour which caused the change event to emit twice.
        this.preventDefault(event);
    }

    async sacarTamano(event: any, tipo: number) {
        let result;
        let val: ImageDimension[] = [];
        const reader = new FileReader();

        if (tipo === EXPLORADOR) {
            let files: any[] = event.target.files;
            for (const file of files) {
                reader.readAsDataURL(file);
                val.push(
                    await new Promise<{ width: number; height: number }>(
                        (resolve) => {
                            reader.onload = async (e: any) => {
                                console.log('e', e);
                                result = await this.getImageDimenstion(
                                    e.target.result
                                );
                                resolve({
                                    width: result.width,
                                    height: result.height,
                                });
                            };
                        }
                    )
                );
            }
        }

        if (tipo === ARRASTRE) {
            // using from drag and drop
            var _URL = window.URL || window.webkitURL;
            let files: any[] = event.dataTransfer.items;
            let lista: any[] = [];
            let file: any;

            for (const x of files) {
                file = x.getAsFile();
                lista.push(this.getListImagesDimension(file));
            }
            val = await Promise.all(lista);
        }

        console.log({ event, val });

        return { event, val };
    }

    async getListImagesDimension(file) {
        var _URL = window.URL || window.webkitURL;
        let img = new Image();
        return new Promise((resolve) => {
            img.src = _URL.createObjectURL(file);
            img.onload = (event) => {
                let loadedImage = event.currentTarget;
                resolve({
                    width: loadedImage['width'],
                    height: loadedImage['height'],
                });
            };
        });
    }

    async getImageDimenstion(
        imgUrl
    ): Promise<{ width: number; height: number }> {
        let width1: number = 0;
        let heigh2t: number = 0;

        const { width, height } = await new Promise((resolve) => {
            let img = new Image();
            img.src = imgUrl;
            img.onload = (event) => {
                let loadedImage = event.currentTarget;
                resolve({
                    width: loadedImage['width'],
                    height: loadedImage['height'],
                });
            };
        });
        return { width, height };
    }

    private handleFileDrop(files: FileList) {
        const result = this.service.parseFileList(
            files,
            this.accept,
            this.maxFileSize,
            this.multiple
        );

        this.change.next({
            addedFiles: result.addedFiles,
            rejectedFiles: result.rejectedFiles,
            contImagesDenied: this.contImagesDenied,
            ratio: this.ratio,
            source: this,
        });
    }

    private preventDefault(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    VerificarRatioImagenes(
        files: FileList,
        ratio: string[],
        applyRatio: boolean,
        listImagesDimension: ImageDimension[]
    ): DataTransfer {
        let limit1_width: number = 1;
        let limit1_height: number = 1;
        let limit2_width: number = 1;
        let limit2_height: number = 1;
        let ratio_vertical: number = 1;
        let ratio_horizontal: number = 1;
        let listFilesAllowed = new DataTransfer();

        limit1_width = Number(ratio[0].split(':')[0]);
        limit1_height = Number(ratio[0].split(':')[1]);
        limit2_width = Number(ratio[1].split(':')[0]);
        limit2_height = Number(ratio[1].split(':')[1]);

        ratio_vertical = limit1_height / limit1_width; // imagen vertical
        ratio_horizontal = limit2_height / limit2_width; //imagen  horizontal

        listImagesDimension.forEach((imageDimension, index) => {
            if (applyRatio) {
                const ratioInput = imageDimension.height / imageDimension.width;
                if (
                    ratio_vertical >= ratioInput &&
                    ratioInput >= ratio_horizontal
                ) {
                    listFilesAllowed.items.add(files.item(index));
                    this.contImagesDenied = 0;
                } else {
                    this.contImagesDenied++;
                }
            } else {
                listFilesAllowed.items.add(files.item(index));
                this.contImagesDenied = 0;
            }
        });
        return listFilesAllowed;
    }
}