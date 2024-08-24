import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SaleNote } from 'app/models/sale-note';
import { SaleNoteService } from '../sale-note.service';
import { STATUS_ORDER } from '../../../../enums/status.enum';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatSelectChange } from '@angular/material/select';

const all = 'TODO';
@Component({
    selector: 'sale-note-list',
    templateUrl: './list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        /* language=SCSS */
        `
            :host ::ng-deep {
                table {
                    &.mat-table {
                        tbody {
                            background-color: white;
                        }
                    }
                }
            }
            .mat-column-client {
                width: 20% !important;
              }
            .mat-column-document {
                width: 15% !important;
             }
            .mat-column-serie {
                width: 10% !important;
              }
            .mat-column-documentnumber {
                width: 15% !important;
            }
            .mat-column-salestotal {
                width: 18% !important;
                text-align: center !important;
            }
            .mat-column-status {
                width: 8% !important;
            }
            .mat-column-actions {
                width: 14% !important;
            }
            .header-align-right{
                ::ng-deep .mat-sort-header-container {
                    display:flex;
                    justify-content: flex-end;
                  }
              }
            .header-align-center{
                ::ng-deep .mat-sort-header-container {
                    display:flex;
                    justify-content:center;
                  }
              }

            .inventory-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 5rem 112px auto 3rem 72px;
                }

                @screen lg {
                    grid-template-columns: 5rem 112px auto 3rem 96px 96px 72px;
                }
            }
            .editIcon:hover{
                color: blue !important;
            }
            .deleteIcon:hover{
                color: red !important;
            }
            .printIcon:hover{
                color: green !important;
            }
        `,
    ],
})
export class SaleNoteListComponent implements OnInit, AfterViewInit, OnDestroy  {
    @ViewChild('recentTransactionsTable', { read: MatSort })
    recentTransactionsTableMatSort: MatSort;
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    recentTransactionsDataSource: MatTableDataSource<any> =
        new MatTableDataSource();
    recentTransactionsTableColumns: string[] = [
        'client',
        'document',
        'serie',
        'documentnumber',
        'salestotal',
        'status',
        'actions',
    ];
    public salesNotes: SaleNote[];
    public salesNotesFiltered: SaleNote[] = [];
    public statusList: string[] = STATUS_ORDER;
    searchInputControlClient: FormControl = new FormControl();
    status: FormControl = new FormControl(all);
    searchInputControl: FormControl = new FormControl();
    isLoading: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private saleNoteService: SaleNoteService,
        private router: Router,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService
    ) {}

    ngAfterViewInit() {
        this.recentTransactionsDataSource.sort = this._sort;
      }

    ngOnInit(): void {
        this.loadListSaleNote();
        this.searchInputControlClient.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((queryInput: string) => {
                    this.isLoading = true;
                    const query = (queryInput as string).toLowerCase();
                    return (this.recentTransactionsDataSource.data =
                        this.salesNotes.filter((salesNote) => {
                            return (salesNote.client.comercialName as string)
                                .toLowerCase()
                                .match(query) &&  (this.status.value === all || this.status.value === salesNote.status) ;
                        }));
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();
    }

    statusChange(select: MatSelectChange): void{
        console.log('value', select.value, this.salesNotes)
        if (select.value != all) {
            this.recentTransactionsDataSource.data = this.salesNotes.filter((salesNote) => {
                return (salesNote.status as string).match(select.value);
            });
         }else{
            this.recentTransactionsDataSource.data = this.salesNotes;
         }

    }

    loadListSaleNote(): void {
        // Get the courses
        this.saleNoteService.saleNotes$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((resp: any) => {
                console.log('resp', resp);
                this.salesNotes = resp;
                this.recentTransactionsDataSource.data = this.salesNotes;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    editSaleNote(id: string): void {
        this.router.navigate([`/salenote/edit/${id}`]);
    }

    deleteSaleNote(id: string): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Eliminar Nota Venta',
            message:
                '¿Estás seguro(a) de eliminar esta nota venta? Esta acción no puede deshacerse!',
            actions: {
                confirm: {
                    label: 'Eliminar',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                this.saleNoteService.deleteSaleNote(id).subscribe((resp) => {
                    if (resp.ok) {
                        this.saleNoteService
                            .getListSaleNote()
                            .pipe(take(1))
                            .subscribe();
                    }
                });
            }
        });
    }

    printSaleNote(id: string): void {
        this.router.navigate([`/salenote/print/${id}`]);
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
