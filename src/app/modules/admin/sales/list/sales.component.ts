import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl,
} from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AsyncPipe, CurrencyPipe, DOCUMENT, DatePipe, I18nPluralPipe, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { STATUS_ORDER } from 'app/enum/status.enum';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { Sales } from '../sales.types';
import { SalesService } from '../sales.service';

@Component({
    selector: 'app-sales',
    templateUrl: './sales.component.html',
    styles: [
        /* language=SCSS */
        `
        .inventory-grid {
            grid-template-columns: 48px auto 40px;

            @screen sm {
                grid-template-columns: 48px auto 112px 72px;
            }

            @screen md {
                grid-template-columns: 48px 112px auto 112px 72px;
            }

            @screen lg {
                grid-template-columns: repeat(6, 1fr) 112px;
            }
        }
    `,
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        AsyncPipe,
        CurrencyPipe,
        DatePipe,
        RouterModule
    ],
})
export class SalesListComponent implements OnInit {
    // MIGRATION
    public statusList: string[] = STATUS_ORDER;
    products$: Observable<Sales[]>;
    status: UntypedFormControl = new UntypedFormControl();
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    isLoading: boolean = false;
    constructor(
        private _salesService: SalesService,
        public dialog: MatDialog,
    ) { }

    ngOnInit(): void {
        // Get the products
        this.products$ = this._salesService.sales$;
    }


    addNewOrder(): void {

    }

    /**
       * Track by function for ngFor loops
       *
       * @param index
       * @param item
       */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
