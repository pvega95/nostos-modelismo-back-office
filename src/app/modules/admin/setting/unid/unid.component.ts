import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Brand } from 'app/models/brand';
import { Unid } from 'app/models/unid';
import { Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { UnidService } from './unid.service';

@Component({
    selector: 'app-unid',
    templateUrl: './unid.component.html',
    styles: [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: repeat(4, auto);

                @screen sm {
                    grid-template-columns: repeat(4, 1fr);
                }

                @screen md {
                    grid-template-columns: repeat(4, 1fr);
                }

                @screen lg {
                    grid-template-columns: repeat(4, 1fr);
                }
            }
        `,
    ],
    animations: fuseAnimations,
})
export class UnidComponent implements OnInit {
    public unids: Unid[] = [];
    public isLoading: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    searchInputControl: FormControl = new FormControl();
    unidsFiltered: any[] = [];
    selectedUnid: any = null;
    selectedUnidForm: FormGroup;

    seeMessage: boolean = false;
    successMessage: string;
    flashMessage: boolean;
    constructor(
        private unidService: UnidService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _datePipe: DatePipe,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.initForm();
        this.loadListBrand();
        this.searchInputControl.valueChanges
        .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300),
            switchMap((queryInput: string) => {
                this.isLoading = true;
                const query = (queryInput as string).toLowerCase();
                return (this.unidsFiltered =
                    this.unids.filter((unid) => {
                        return (unid.description as string)
                            .toLowerCase()
                            .match(query)  ;
                    }));
            }),
            map(() => {
                this.isLoading = false;
            })
        )
        .subscribe();
    }

    createUnid(): void {
        this.unids.unshift({
            _id: '-1',
            description: '',
            abreviation: '',
            status: true,
            createdAt: null,
            updatedAt: null,
        });
        this.selectedUnid = {
            _id: '-1',
            description: 'Nueva unidad',
            abreviation: '',
            status: true,
            createdAt: null,
            updatedAt: null,
        };
        this.selectedUnidForm.setValue({
            _id: '-1',
            description: '',
            abreviation: '',
            status: true,
            createdAt: null,
            updatedAt: null,
        });
        this._changeDetectorRef.markForCheck();
        this.unidsFiltered = this.unids;
    }

    loadListBrand(): void {
        this.unidService.listarUnidad().subscribe((resp) => {
            if (resp.ok) {
                this.unids = resp.data;
                this.unidsFiltered = this.unids;
                this.isLoading = false;
            }
        });
    }

    toggleDetails(brandId: string): void {
        // If the company is already selected...
        if (this.selectedUnid) {
            if (this.selectedUnid._id === brandId) {
                // Close the details
                this.closeDetails();
                return;
            }
        }
        this.successMessage = '';
        this.seeMessage = false;
        // this.initForm();
        // Get the company by id
        const brandFounded =
            this.unids.find((item: Brand) => item._id === brandId) || null;
        this.selectedUnid = brandFounded;
        if (brandFounded._id) {
            this.selectedUnidForm.patchValue({
                _id: brandFounded._id,
                description: brandFounded.description,
                abreviation: brandFounded.abreviation,
                status: brandFounded.status,
                createdAt: this._datePipe.transform(brandFounded.createdAt),
                updatedAt: this._datePipe.transform(brandFounded.updatedAt),
            });
        }
    }

    closeDetails(): void {
        this.selectedUnid = null;
    }

    initForm(): void {
        this.selectedUnidForm = this._formBuilder.group({
            _id: ['-1'],
            description: ['',  [Validators.required, Validators.minLength(5)]],
            abreviation: ['', [Validators.required, Validators.minLength(1)]],
            status: [''],
            createdAt: [''],
            updatedAt: [''],
        });
        this.selectedUnidForm.controls.createdAt.disable();
        this.selectedUnidForm.controls.updatedAt.disable();
    }

    createNewUnit(): void {
        this.isLoading = true;
        const brand = this.selectedUnidForm.value;
        delete brand._id;
        this.unidService.crearUnidad(brand).subscribe((resp) => {
            this.flashMessage = resp.ok;
            this.seeMessage = true;
            if (resp.ok) {
                this.successMessage = resp.message;
                this.isLoading = false;
                setTimeout(() => {
                    // 2 segundo se cierra
                    this.seeMessage = false;
                }, 2000);
                setTimeout(() => {
                    this.loadListBrand();
                    this.closeDetails();
                }, 1000);
            }
        });
    }

    updateselectedUnid(id: string): void {
        this.isLoading = true;
        const brand = this.selectedUnidForm.value;
        this.unidService.editarUnidad(id, brand).subscribe((resp) => {
            this.flashMessage = resp.ok;
            this.seeMessage = true;
            if (resp.ok) {
                this.successMessage = resp.message;
                this.isLoading = false;
                setTimeout(() => {
                    // 2 segundo se cierra
                    this.seeMessage = false;
                }, 2000);
                setTimeout(() => {
                    this.loadListBrand();
                    this.closeDetails();
                }, 1000);
            }
        });
    }

    deleteselectedUnid(id: string): void {
        if (this.selectedUnidForm.get('_id').value === '-1') {
            this.unids = this.unids.filter((unid) => unid._id !== '-1');
            this.unidsFiltered = this.unids;
        } else {
            const confirmation = this._fuseConfirmationService.open({
                title: 'Eliminar marca',
                message:
                    '¿Estás seguro(a) que quieres eliminar este marca?. Esta acción no puede deshacerse!',
                actions: {
                    confirm: {
                        label: 'Eliminar',
                    },
                },
            });
            confirmation.afterClosed().subscribe((result) => {
                if (result === 'confirmed' ) {
                  if(id !== '-1'){
                    this.unidService.eliminarUnidad(id).subscribe((resp) => {
                      this.flashMessage = resp.ok;
                      this.seeMessage = true;
                      if (resp.ok) {
                          this.successMessage = resp.message;
                          this.isLoading = false;
                          setTimeout(() => {
                              // 2 segundo se cierra
                              this.seeMessage = false;
                          }, 2000);
                          setTimeout(() => {
                              this.loadListBrand();
                              this.closeDetails();
                          }, 1000);
                      }
                  });
                  } else {
                    // Find the index of the deleted product
                    const index = this.unids.findIndex(item => item._id === id);
    
                    // Delete the product
                    this.unids.splice(index, 1);
                  }
                }
            });
        }

    }
}
