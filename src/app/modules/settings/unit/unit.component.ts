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
import { Unit } from 'app/models/unit';
import { UnitService } from './unit.service';
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
import { DatePipe } from '@angular/common';
import { IUnitBody } from './interfaces';

@Component({
    selector: 'app-unit',
    templateUrl: './unit.component.html',
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
    animations: fuseAnimations,
})
export class UnitComponent implements OnInit, OnDestroy {
    public units: Unit[] = [];
    public isLoading: boolean;
    searchInputControl: FormControl = new FormControl();
    unitsFiltered: any[] = [];
    selectedUnit: any = null;
    selectedUnitForm: FormGroup;

    seeMessage: boolean = false;
    successMessage: string;
    flashMessage: boolean;
    canDisableButtonAddNewUnit: boolean = false;

    private _unsubscribeAll: Subject<void> = new Subject<void>();
    constructor(
        private unitService: UnitService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private datePipe: DatePipe
    ) {}

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    ngOnInit(): void {
        this.initForm();
        this.loadListUnit();
        this.searchInputControl.valueChanges
        .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300),
            switchMap((queryInput) => {
                this.closeDetails();
                this.isLoading = true;
                const query = (queryInput as string).toLowerCase();
                 this.unitsFiltered = this.units.filter(
                    (unit) => {
                        return (
                            parseStringWithoutAccents(
                            (unit.description as string)
                                .toLowerCase())
                                .match(query) ||
                                parseStringWithoutAccents(
                            (unit.abreviation as string)
                                .toLowerCase())
                                .match(query)
                        );
                    }
                );
                this.isLoading = false;
                return this.unitsFiltered;
            })
        )
        .subscribe();
    }

    createUnit(): void {
        this.units.unshift({
            _id: '-1',
            description: 'Nueva unidad',
            abreviation: '',
            status: true,
            createdAt: '',
            updatedAt: '',
        });
        this.selectedUnit = {
            _id: '-1',
            description: 'Nueva unidad',
            abreviation: '',
            status: true,
            createdAt: '',
            updatedAt: '',
        };
        this.selectedUnitForm.patchValue({
            id: '-1',
            description: '',
            abreviation: '',
            status: true,
            createdAt: '',
            updatedAt: '',
        });
        this.unitsFiltered = this.units;
        this.canDisableButtonAddNewUnit = true;
        this.searchInputControl.setValue('',{emitEvent: false});
    }

    loadListUnit(): void {
        this.canDisableButtonAddNewUnit = false;
        this.isLoading = true;
        this.unitService.getListUnit().subscribe((resp) => {
            if (resp.ok) {
                this.units = resp.data;
                this.unitsFiltered = this.units;
                this.isLoading = false;
            }
        });
    }

    toggleDetails(unitId: string): void {
        // If the unit is already selected...
        if (this.selectedUnit) {
            if (this.selectedUnit._id === unitId) {
                // Close the details
                this.closeDetails();
                return;
            }
        }
        this.successMessage = '';
        this.seeMessage = false;
        // Get the unit by id
        const unitIdFound =
            this.units.find((item: Unit) => item._id === unitId) || null;
        this.selectedUnit = unitIdFound;

        if (unitIdFound._id) {
            this.selectedUnitForm.patchValue({
                id: unitIdFound._id,
                description: unitIdFound.description,
                abreviation: unitIdFound.abreviation,
                status: unitIdFound.status,
                createdAt: unitIdFound.createdAt !== ''
                ? this.datePipe.transform(unitIdFound.createdAt,'dd/MM/yyyy')
                : '',
                updatedAt: unitIdFound.updatedAt !== ''
                ? this.datePipe.transform(unitIdFound.updatedAt,'dd/MM/yyyy')
                : '',
            });
        }
    }

    closeDetails(): void {
        this.selectedUnit = null;
    }

    initForm(): void {
        this.selectedUnitForm = this._formBuilder.group({
            id: [''],
            description: ['',
                [Validators.required, FuseUtilsService.withoutBlankSpaces],
            ],
            abreviation: [''],
            status: [''],
            createdAt: [''],
            updatedAt: [''],
        });
        this.selectedUnitForm.controls.createdAt.disable();
        this.selectedUnitForm.controls.updatedAt.disable();
    }

    createNewUnit(): void {
        this.isLoading = true;
        const unit = this.selectedUnitForm.value as IUnitBody;

        this.unitService.createUnit(unit).subscribe((resp) => {
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
                    this.loadListUnit();
                    this.closeDetails();
                }, 1000);
            }
        });
    }

    updateselectedUnit(id: string): void {
        this.isLoading = true;
        const unit = this.selectedUnitForm.value as IUnitBody;
        this.unitService.editUnit(id, unit).subscribe((resp) => {
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
                    this.loadListUnit();
                    this.closeDetails();
                }, 1000);
            }
        });
    }

    deleteselectedUnit(id: string): void {
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
                this.unitService.deleteUnit(id).subscribe((resp) => {
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
                          this.loadListUnit();
                          this.closeDetails();
                      }, 1000);
                  }
              });
              } else {
                // Find the index of the deleted unit
                const index = this.units.findIndex(item => item._id === id);
                this.canDisableButtonAddNewUnit = false;
                // Delete the unit
                this.units.splice(index, 1);
              }
            }
        });
    }
}
