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
import { saleNoteRoutes } from 'app/modules/admin/sale-note/sale-note.routing';
import { SaleNoteComponent } from './sale-note.component';
import { TranslocoModule } from '@ngneat/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatInputModule } from '@angular/material/input';
import { IMaskModule } from 'angular-imask';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CreateEditSaleNoteComponent } from './create-edit-sale-note/create-edit-sale-note.component';
import { SaleNoteListComponent } from './list/list.component';
import { SaleNoteItemComponent } from './create-edit-sale-note/sale-note-item/sale-note-item.component';
import { SummarySaleNoteComponent } from './create-edit-sale-note/summary-sale-note/summary-sale-note.component';
import { CommonModule } from '@angular/common';
import { InvoiceComponent } from './invoice/invoice.component';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { PaginatorIntl } from 'app/shared/services/paginator-intl.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ClientInfoComponent } from './create-edit-sale-note/client-info/client-info.component';

@NgModule({
    declarations: [
        SaleNoteComponent,
        CreateEditSaleNoteComponent,
        SaleNoteListComponent,
        SaleNoteItemComponent,
        SummarySaleNoteComponent,
        InvoiceComponent,
        ClientInfoComponent
    ],
    imports     : [
        RouterModule.forChild(saleNoteRoutes),
        MatFormFieldModule,
        ScrollingModule,
        IMaskModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
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
        MatSidenavModule,
        NgApexchartsModule,
        SharedModule
    ],
    providers :[
        {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
        {provide: MatPaginatorIntl, useClass: PaginatorIntl},
    ]
})
export class SaleNoteModule
{
}
