import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements OnInit {
    @Input() ratio: string[] = ['1:2', '2:1'];
    @Input() files: File[] = [];
    @Output() filesLoaded = new EventEmitter<File[]>();
    @Output() filesDeleted = new EventEmitter<File>();
    errorMessage: string = '';
    filesNames: string = null;

    constructor() {}

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.files && changes.files.currentValue !== changes.files.previousValue) {
            this.getFileNames(this.files);
          }
    }

    onSelect(event): void {

        console.log('onSelect', event)
        if (event.contImagesDenied > 0) {
            this.errorMessage =
                'La(s) imagen(es) no cumplen con el ratio (ancho/alto) de ' +
                event.ratio[0] +
                ' y ' +
                event.ratio[1];
        } else {
            this.errorMessage = '';
        }
        this.files.push(...event.addedFiles);
        this.getFileNames(this.files);
        this.filesLoaded.emit(this.files);
    }

    getFileNames(files: Array<any>): void {
        if (files.length > 1) {
            this.filesNames = files.map(file => file.name).join(', ');;
        } else if (files.length === 0) {
            this.filesNames = null;
        } else {
            this.filesNames = files[0].name;
        }
    }

    onRemove(event): void {
        console.log(event);
        this.errorMessage = '';
        this.files.splice(this.files.indexOf(event), 1);
        this.getFileNames(this.files);
        this.filesLoaded.emit(this.files);
        this.filesDeleted.emit(event);
    }
}
