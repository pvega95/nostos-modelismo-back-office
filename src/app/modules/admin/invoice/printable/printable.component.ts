import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SaleNote } from 'app/models/sale-note';
import { map } from 'rxjs/operators';
import { InvoiceService } from '../invoice.service';

@Component({
    selector: 'printable',
    templateUrl: './printable.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicePrintableComponent implements OnInit {
    public saleNote: SaleNote;
    public isLoading: boolean;
    /**
     * Constructor
     */
    constructor(
        private invoiceService: InvoiceService,
        private route: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe(({ id }) => {
            if (id) {
                this.getSaleNoteDetail(id);
            }
        });
    }

    getSaleNoteDetail(id: string): void {
        this.isLoading = true;
        this.invoiceService
            .getListInvoiceById(id)
            .pipe(map((resp: any) => resp.data))
            .subscribe((saleNote) => {
                this.isLoading = false;
                this.saleNote = new SaleNote(saleNote[0]);
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }
}
