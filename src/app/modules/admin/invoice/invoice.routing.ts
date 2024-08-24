import { Route } from '@angular/router';
import { InvoiceListComponent } from './list/list.component';
import { CreateEditInvoiceComponent } from './create-edit-invoice/create-edit-invoice.component';
import { InvoiceInitialDataResolver, InvoiceListResolver } from './invoice.resolvers';
import { InvoicePrintableComponent } from './printable/printable.component';
import { InvoiceComponent } from './invoice.component';

export const invoiceRoutes: Route[] = [
    {
        path     : '',
        component: InvoiceComponent,
        children : [
            {
                path     : '',
                pathMatch: 'full',
                component: InvoiceListComponent,
                resolve  : {
                    saleNotes : InvoiceListResolver
                },
            },
            {
                path     : 'new',
                component: CreateEditInvoiceComponent,
                resolve    : {
                    saleNoteInitalData: InvoiceInitialDataResolver,
                },
            },
            {
                path     : 'edit/:id',
                component: CreateEditInvoiceComponent,
                resolve    : {
                    saleNoteInitalData: InvoiceInitialDataResolver,
                },
            },
            {
                path     : 'print/:id',
                component: InvoicePrintableComponent
            },
        ]
    }
];
