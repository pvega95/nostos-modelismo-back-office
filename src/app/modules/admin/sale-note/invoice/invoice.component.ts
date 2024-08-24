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
import { SaleNoteService } from '../sale-note.service';

@Component({
    selector: 'invoice',
    templateUrl: './invoice.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceComponent implements OnInit {
    public saleNote: SaleNote;
    public isLoading: boolean;
    /**
     * Constructor
     */
    constructor(
        private saleNoteService: SaleNoteService,
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

    getSaleNoteDetail(id: string) {
        this.isLoading = true;
        this.saleNoteService
            .getListSaleNoteById(id)
            .pipe(map((resp) => resp.data))
            .subscribe((saleNote) => {
                this.isLoading = false;
                this.saleNote = new SaleNote(saleNote[0]);
                console.log(this.saleNote);
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }
}
