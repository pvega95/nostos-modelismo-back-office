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
import { Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { BrandService } from './brand.service';

@Component({
    selector: 'app-brand',
    templateUrl: './brand.component.html',
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
export class BrandComponent implements OnInit {
    public brands: Brand[] = [];
    public isLoading: boolean;
    searchInputControl: FormControl = new FormControl();
    brandsFiltered: any[] = [];
    selectedBrand: any = null;
    selectedBrandForm: FormGroup;

    seeMessage: boolean = false;
    successMessage: string;
    flashMessage: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private brandService: BrandService,
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
            switchMap((queryInput) => {
                this.closeDetails();
                this.isLoading = true;
                const query = (queryInput as string).toLowerCase();
                return (this.brandsFiltered = this.brands.filter(
                    (brand) => {
                        return (
                            brand.description
                                .toLowerCase()
                                .match(query) ||
                            brand.abreviation
                                .toLowerCase()
                                .match(query)
                        );
                    }
                ));
            }),
            map(() => {
                this.isLoading = false;
            })
        )
        .subscribe();
    }

    createBrand(): void {
        this.brands.unshift({
            _id: '-1',
            description: '',
            abreviation: '',
            status: true,
            createdAt: null,
            updatedAt: null,
        });
        this.selectedBrand = {
            _id: '-1',
            description: 'Nueva descripcion',
            abreviation: '',
            status: true,
            createdAt: null,
            updatedAt: null,
        };
        this.selectedBrandForm.patchValue({
            _id: '-1',
            description: '',
            abreviation: '',
            status: true,
            createdAt: null,
            updatedAt: null,
        });
        this._changeDetectorRef.markForCheck();
        this.brandsFiltered = this.brands;
    }

    loadListBrand(): void {
        this.brandService.listarMarca().subscribe((resp) => {
            if (resp.ok) {
                this.brands = resp.data;
                this.brandsFiltered = this.brands;
                this.isLoading = false;
            }
        });
    }

    toggleDetails(brandId: string): void {
        // If the company is already selected...
        if (this.selectedBrand) {
            if (this.selectedBrand._id === brandId) {
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
            this.brands.find((item: Brand) => item._id === brandId) || null;
        this.selectedBrand = brandFounded;
        if (brandFounded._id) {
            this.selectedBrandForm.patchValue({
                _id: brandFounded._id,
                description: brandFounded.description,
                abreviation: brandFounded.abreviation,
                createdDate: this._datePipe.transform(brandFounded.createdAt),
                updatedDate: this._datePipe.transform(brandFounded.updatedAt),
            });
        }
    }

    closeDetails(): void {
        this.selectedBrand = null;
    }

    initForm(): void {
        this.selectedBrandForm = this._formBuilder.group({
            _id: ['-1'],
            status: true,
            description: ['', [Validators.required, Validators.minLength(4)]],
            abreviation: ['', [Validators.required, Validators.minLength(1)]],
            createdDate: [''],
            updatedDate: [''],
        });
        this.selectedBrandForm.controls.createdDate.disable();
        this.selectedBrandForm.controls.updatedDate.disable();
    }

    createNewBrand(): void {
        this.isLoading = true;
        let brand = this.selectedBrandForm.value;
        delete brand._id;
        console.log('marca',brand)
        this.brandService.crearMarca(brand).subscribe((resp) => {
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

    updateSelectedBrand(id: string): void {
        this.isLoading = true;
        const brand = this.selectedBrandForm.value;
        this.brandService.editarMarca(id, brand).subscribe((resp) => {
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

    deleteSelectedBrand(id: string): void {
        if (this.selectedBrandForm.get('_id').value === '-1') {
            this.brands = this.brands.filter((brand) => brand._id !== '-1');
            this.brandsFiltered = this.brands;
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
                    this.brandService.eliminarMarca(id).subscribe((resp) => {
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
                    const index = this.brands.findIndex(item => item._id === id);
    
                    // Delete the product
                    this.brands.splice(index, 1);
                  }
                }
            });
        }

    }
}
