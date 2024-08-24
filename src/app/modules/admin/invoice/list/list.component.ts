import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SaleNote } from 'app/models/sale-note';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { InvoiceService } from '../invoice.service';
import { Invoice } from 'app/models/apis-peru/factura';
import { SunatService } from 'app/shared/services/sunat.service';
@Component({
    selector: 'invoice-list',
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

            .inventory-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 112px auto 112px 72px;
                }

                @screen lg {
                    grid-template-columns: 48px 112px auto 112px 96px 96px 72px;
                }
            }
            .editIcon:hover {
                color: blue !important;
            }
            .deleteIcon:hover {
                color: red !important;
            }
            .printIcon:hover {
                color: green !important;
            }
        `,
    ],
})
export class InvoiceListComponent implements OnInit {
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
        'actions',
    ];
    public salesNotes: SaleNote[];
    public salesNotesFiltered: SaleNote[] = [];
    searchInputControlClient: FormControl = new FormControl();
    searchInputControl: FormControl = new FormControl();
    isLoading: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private invoiceService: InvoiceService,
        private router: Router,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _sunatService: SunatService
    ) {}

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
                        this.salesNotes.filter(salesNote =>
                            (salesNote.client.comercialName as string)
                                .toLowerCase()
                                .match(query)
                        ));
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();
    }

    loadListSaleNote(): void {
        // Get the courses
        this.invoiceService.saleNotes$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((resp: any) => {
                this.salesNotes = this.salesNotesFiltered = resp.data;
                this.recentTransactionsDataSource.data = this.salesNotes;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    editSaleNote(id: string): void {
        this.router.navigate([`/invoice/edit/${id}`]);
    }

    deleteSaleNote(id: string): void {
        //comentario
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
                this.invoiceService.deleteInvoice(id).subscribe((resp) => {
                    if (resp.ok) {
                        this.invoiceService
                            .getListInvoice()
                            .pipe(take(1))
                            .subscribe();
                    }
                });
            }
        });
    }

    printSaleNote(id: string): void {
        this.router.navigate([`/invoice/print/${id}`]);
    }

    sendInvoice(invoice: any): void {
        console.log(invoice);
        const factura = new Invoice();
        factura.setClient(invoice);
        factura.setPayment(invoice);
        factura.setCompany(invoice);
        factura.setDetails(invoice);
        factura.setLegends(invoice);
        factura.setOthers(invoice);
        console.log(factura);
        this._sunatService.sendDocument(factura).subscribe((resp) => {
            console.log(resp);
        });
    }
}
