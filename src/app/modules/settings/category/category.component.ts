import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Brand } from 'app/models/brand';
import { CategoryService } from './category.service';
import { FuseUtilsService } from '@fuse/services/utils';
import { debounceTime, Subject, switchMap, takeUntil } from 'rxjs';
import { parseStringWithoutAccents } from 'app/utils/form';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@ngneat/transloco';
import { IMaskModule } from 'angular-imask';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { IBrandBody } from './interfaces';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    standalone: true,
    imports: [
        RouterModule,
        MatInputModule,
        MatProgressSpinnerModule,
        IMaskModule,
        MatFormFieldModule,
        TranslocoModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule,
        NgApexchartsModule,
        CommonModule,
        MatSelectModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatInputModule,
        MatTableModule,
        ScrollingModule,
        NgxMatSelectSearchModule,
        FormsModule,
        MatProgressBarModule,
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
    ],
    providers: [DatePipe],
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

})
export class CategoryComponent implements OnInit {
    public categories: any[] = [];
    public isLoading: boolean;
    searchInputControl: FormControl = new FormControl();
    categoryFiltered: any[] = [];
    selectedCategory: any = null;
    selectedCategoryForm: FormGroup;

    seeMessage: boolean = false;
    successMessage: string;
    flashMessage: boolean;
    canDisableButtonAddNewCategory: boolean = false;

    private _unsubscribeAll: Subject<void> = new Subject<void>();
    constructor(
        private  categoryService: CategoryService,
        private  _formBuilder: FormBuilder,
        private  _fuseConfirmationService: FuseConfirmationService,
        private datePipe: DatePipe
    ) {}

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    ngOnInit(): void {
        this.initForm();
        this.loadListCategory();
        this.searchInputControl.valueChanges
        .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300),
            switchMap((queryInput) => {
                this.closeDetails();
                this.isLoading = true;
                const query = (queryInput as string).toLowerCase();
                 this.categoryFiltered = this.categories.filter(
                    (unid) => {
                        return (
                            parseStringWithoutAccents(
                            (unid.description as string)
                                .toLowerCase())
                                .match(query) ||
                                parseStringWithoutAccents(
                            (unid.abreviation as string)
                                .toLowerCase())
                                .match(query)
                        );
                    }
                );
                this.isLoading = false;
                return this.categoryFiltered
            })
        )
        .subscribe();
    }

    createCategory(): void {

        this.categories.unshift({
            _id: '-1',
            name: '',
            thumbnail: '',
            createdAt: '',
            updatedAt: ''
        });
        this.selectedCategory = {
            _id: '-1',
            name: '',
            thumbnail: '',
            createdAt: '',
            updatedAt: ''
        };
        this.selectedCategoryForm.patchValue({
            id: '-1',
            name: '',
            thumbnail: '',
            createdAt: '',
            updatedAt: ''
        });
        this.categoryFiltered = this.categories;
        this.canDisableButtonAddNewCategory = true;
        this.searchInputControl.setValue('',{emitEvent: false});
    }

    loadListCategory(): void {
        this.canDisableButtonAddNewCategory = false;
        this.isLoading = true;
        this.categoryService.getListCategory().subscribe((resp) => {
            if (resp.ok) {
                this.categories = resp.data;
                this.categoryFiltered = this.categories;
                this.isLoading = false;
            }
        });
    }

    toggleDetails(brandId: string): void {
        // If the company is already selected...
        if (this.selectedCategory) {
            if (this.selectedCategory._id === brandId) {
                // Close the details
                this.closeDetails();
                return;
            }
        }
        this.successMessage = '';
        this.seeMessage = false;
        // Get the company by id
        const categoryFounded =
            this.categories.find((item: Brand) => item._id === brandId) || null;
        this.selectedCategory = categoryFounded;
        if (categoryFounded._id) {
            this.selectedCategoryForm.patchValue({
                id: categoryFounded._id,
                name: categoryFounded.name,
                thumbnail: categoryFounded.thumbnail,
                createdAt: categoryFounded.createdAt !== ''
                ? this.datePipe.transform(categoryFounded.createdAt,'dd/MM/yyyy')
                : '',
                updatedAt: categoryFounded.updatedAt !== ''
                ?  this.datePipe.transform(categoryFounded.updatedAt,'dd/MM/yyyy')
                : '',
            });
        }
    }

    closeDetails(): void {
        this.selectedCategory = null;
    }

    initForm(): void {
        this.selectedCategoryForm = this._formBuilder.group({
            id: [''],
            name: ['',
                [Validators.required, FuseUtilsService.withoutBlankSpaces],
            ],
            thumbnail: [''],
            createdAt: [''],
            updatedAt: [''],
        });
        this.selectedCategoryForm.controls.createdAt.disable();
        this.selectedCategoryForm.controls.updatedAt.disable();
    }

    createNewCategory(): void {
        this.isLoading = true;
        const brand = this.selectedCategoryForm.value as IBrandBody;
        this.categoryService.createCategory(brand).subscribe((resp) => {
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
                    this.loadListCategory();
                    this.closeDetails();
                }, 1000);
            }
        });
    }

    updateSelectedCategory(id: string): void {
        this.isLoading = true;
        const brand = this.selectedCategoryForm.value as IBrandBody;
        this.categoryService.editCategory(id, brand).subscribe((resp) => {
            this.flashMessage = resp.success;
            this.seeMessage = true;
            if (resp.success) {
                this.successMessage = resp.message;
                this.isLoading = false;
                setTimeout(() => {
                    // 2 segundo se cierra
                    this.seeMessage = false;
                }, 2000);
                setTimeout(() => {
                    this.loadListCategory();
                    this.closeDetails();
                }, 1000);
            }
        });
    }

    deleteSelectedCategory(id: string): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Eliminar categoria',
            message:
                '¿Estás seguro(a) que quieres eliminar este categoria?. Esta acción no puede deshacerse!',
            actions: {
                confirm: {
                    label: 'Eliminar',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed' ) {
              if(id !== '-1'){
                this.categoryService.deleteCategory(id).subscribe((resp) => {
                  this.flashMessage = resp.success;
                  this.seeMessage = true;
                  if (resp.success) {
                      this.successMessage = resp.message;
                      this.isLoading = false;
                      setTimeout(() => {
                          // 2 segundo se cierra
                          this.seeMessage = false;
                      }, 2000);
                      setTimeout(() => {
                          this.loadListCategory();
                          this.closeDetails();
                      }, 1000);
                  }
              });
              } else {
                // Find the index of the deleted brand
                const index = this.categories.findIndex(item => item._id === id);
                this.canDisableButtonAddNewCategory = false;
                // Delete the brand
                this.categories.splice(index, 1);
              }
            }
        });
    }
}
