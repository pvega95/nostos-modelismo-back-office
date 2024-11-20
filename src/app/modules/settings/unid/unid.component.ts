import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Unid } from 'app/models/unid';
import { UnidService } from './unid.service';
import { FuseUtilsService } from '@fuse/services/utils';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { IMaskModule } from 'angular-imask';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { debounceTime, Subject, switchMap, takeUntil } from 'rxjs';
import { parseStringWithoutAccents } from 'app/utils/form';

@Component({
    selector: 'app-unid',
    templateUrl: './unid.component.html',
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
export class UnidComponent implements OnInit, OnDestroy {
    public unids: Unid[] = [];
    public isLoading: boolean;
    searchInputControl: FormControl = new FormControl();
    unidsFiltered: any[] = [];
    selectedUnid: any = null;
    selectedUnidForm: FormGroup;

    seeMessage: boolean = false;
    successMessage: string;
    flashMessage: boolean;
    canDisableButtonAddNewUnid: boolean = false;

    private _unsubscribeAll: Subject<void> = new Subject<void>();
    constructor(
        private  fuseUtilsService: FuseUtilsService,
        private unidService: UnidService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
    ) {}

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    ngOnInit(): void {
        this.initForm();
        this.loadListUnid();
        this.searchInputControl.valueChanges
        .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300),
            switchMap((queryInput) => {
                this.closeDetails();
                this.isLoading = true;
                const query = (queryInput as string).toLowerCase();
                 this.unidsFiltered = this.unids.filter(
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
                return this.unidsFiltered;
            })
        )
        .subscribe();
    }

    createUnid(): void {
        this.unids.unshift({
            _id: '-1',
            description: 'Nueva unidad',
            abreviation: '',
            status: true,
            createdAt: '',
            updatedAt: '',
        });
        this.selectedUnid = {
            _id: '-1',
            description: 'Nueva unidad',
            abreviation: '',
            status: true,
            createdAt: '',
            updatedAt: '',
        };
        this.selectedUnidForm.patchValue({
            id: '-1',
            description: '',
            abreviation: '',
            status: true,
            createdAt: '',
            updatedAt: '',
        });
        this.unidsFiltered = this.unids;
        this.canDisableButtonAddNewUnid = true;
        this.searchInputControl.setValue('',{emitEvent: false});
    }

    formatoFecha(fecha: string): string{
        return  fecha !== '' ? this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(fecha)) : ''
      }

    loadListUnid(): void {
        this.canDisableButtonAddNewUnid = false;
        this.isLoading = true;
        this.unidService.getListUnid().subscribe((resp) => {
            if (resp.ok) {
                this.unids = resp.data;
                this.unidsFiltered = this.unids;
                this.isLoading = false;
            }
        });
    }

    toggleDetails(unidId: string): void {
        // If the unid is already selected...
        if (this.selectedUnid) {
            if (this.selectedUnid._id === unidId) {
                // Close the details
                this.closeDetails();
                return;
            }
        }
        this.successMessage = '';
        this.seeMessage = false;
        // Get the unid by id
        const unidIdFound =
            this.unids.find((item: Unid) => item._id === unidId) || null;
        this.selectedUnid = unidIdFound;
        if (unidIdFound._id) {
            this.selectedUnidForm.patchValue({
                id: unidIdFound._id,
                description: unidIdFound.description,
                abreviation: unidIdFound.abreviation,
                status: unidIdFound.status,
                createdAt: unidIdFound.createdAt !== ''
                ? this.fuseUtilsService.formatDate(
                      this.fuseUtilsService.stringToDate(
                        unidIdFound.createdAt
                      )
                  )
                : '',
                updatedAt: unidIdFound.updatedAt !== ''
                ? this.fuseUtilsService.formatDate(
                      this.fuseUtilsService.stringToDate(
                        unidIdFound.updatedAt
                      )
                  )
                : '',
            });
        }
    }

    closeDetails(): void {
        this.selectedUnid = null;
    }

    initForm(): void {
        this.selectedUnidForm = this._formBuilder.group({
            id: [''],
            description: ['',
                [Validators.required, FuseUtilsService.withoutBlankSpaces],
            ],
            abreviation: [''],
            status: [''],
            createdAt: [''],
            updatedAt: [''],
        });
        this.selectedUnidForm.controls.createdAt.disable();
        this.selectedUnidForm.controls.updatedAt.disable();
    }

    createNewUnit(): void {
        this.isLoading = true;
        const unid = this.selectedUnidForm.value;
        this.unidService.createUnid(unid).subscribe((resp) => {
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
                    this.loadListUnid();
                    this.closeDetails();
                }, 1000);
            }
        });
    }

    updateselectedUnid(id: string): void {
        this.isLoading = true;
        const unid = this.selectedUnidForm.value;
        this.unidService.editUnid(id, unid).subscribe((resp) => {
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
                    this.loadListUnid();
                    this.closeDetails();
                }, 1000);
            }
        });
    }

    deleteselectedUnid(id: string): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Eliminar unidad',
            message:
                '¿Estás seguro(a) que quieres eliminar esta unidad?. Esta acción no puede deshacerse!',
            actions: {
                confirm: {
                    label: 'Eliminar',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed' ) {
              if(id !== '-1'){
                this.unidService.deleteUnid(id).subscribe((resp) => {
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
                          this.loadListUnid();
                          this.closeDetails();
                      }, 1000);
                  }
              });
              } else {
                // Find the index of the deleted unid
                const index = this.unids.findIndex(item => item._id === id);
                this.canDisableButtonAddNewUnid = false;
                // Delete the unid
                this.unids.splice(index, 1);
              }
            }
        });
    }
}
