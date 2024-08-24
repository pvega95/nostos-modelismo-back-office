import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { TranslocoModule } from '@ngneat/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatInputModule } from '@angular/material/input';
import { IMaskModule } from 'angular-imask';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InvoiceComponent } from './invoice.component';
import { InvoicePrintableComponent } from './printable/printable.component';
import { InvoiceItemComponent } from './create-edit-invoice/item-invoice/item-invoice.component';
import { InvoiceListComponent } from './list/list.component';
import { CreateEditInvoiceComponent } from './create-edit-invoice/create-edit-invoice.component';
import { SummaryInvoiceComponent } from './create-edit-invoice/summary-invoice/summary-invoice.component';
import { invoiceRoutes } from './invoice.routing';



@NgModule({
    declarations: [
        InvoiceComponent,
        InvoicePrintableComponent,
        InvoiceListComponent,
        CreateEditInvoiceComponent,
        SummaryInvoiceComponent,
        InvoiceItemComponent
    ],
    imports     : [
        RouterModule.forChild(invoiceRoutes),
        MatFormFieldModule,
        ScrollingModule,
        IMaskModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatInputModule,
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
        SharedModule
    ]
})
export class InvoiceModule
{
}
