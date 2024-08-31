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
import { BrandService } from './brand.service';
import { FuseUtilsService } from '@fuse/services/utils';

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
    constructor(
        private brandService: BrandService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _datePipe: DatePipe,
        private _changeDetectorRef: ChangeDetectorRef,
        private fuseUtilsService: FuseUtilsService,
    ) {}

    ngOnInit(): void {
        this.initForm();
        this.loadListBrand();
    }

    createBrand(): void {
        this.brands.unshift({
            _id: '-1',
            description: '',
            abreviation: '',
            status: true,
            createdAt: '',
            updatedAt: '',
        });
        this.selectedBrand = {
            _id: '-1',
            description: '',
            abreviation: '',
            status: true,
            createdAt: '',
            updatedAt: '',
        };
        this.selectedBrandForm.patchValue({
            id: '-1',
            description: '',
            abreviation: '',
            status: true,
            createdAt: '',
            updatedAt: '',
        });
        this._changeDetectorRef.markForCheck();
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
                id: brandFounded._id,
                description: brandFounded.description,
                abreviation: brandFounded.abreviation,
                createdDate: brandFounded.createdAt !== ''
                ? this.fuseUtilsService.formatDate(
                      this.fuseUtilsService.stringToDate(
                        brandFounded.createdAt
                      )
                  )
                : '',
                updatedDate: brandFounded.updatedAt !== ''
                ? this.fuseUtilsService.formatDate(
                      this.fuseUtilsService.stringToDate(
                        brandFounded.updatedAt
                      )
                  )
                : '',
            });
        }
    }

    formatoFecha(fecha: string): string {
        return fecha !== ''
            ? this.fuseUtilsService.formatDate(
                  this.fuseUtilsService.stringToDate(fecha)
              )
            : '';
    }

    closeDetails(): void {
        this.selectedBrand = null;
    }

    initForm(): void {
        this.selectedBrandForm = this._formBuilder.group({
            id: [''],
            description: [''],
            abreviation: [''],
            createdDate: [''],
            updatedDate: [''],
        });
        this.selectedBrandForm.controls.createdDate.disable();
        this.selectedBrandForm.controls.updatedDate.disable();
    }

    createNewBrand(): void {
        this.isLoading = true;
        const brand = this.selectedBrandForm.value;
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
        const confirmation = this._fuseConfirmationService.open({
            title: 'Eliminar marca',
            message:
                '¿Estás seguro(a) que quieres eliminar esta marca?. Esta acción no puede deshacerse!',
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
