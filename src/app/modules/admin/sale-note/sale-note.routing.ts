import { Route } from '@angular/router';
import { SaleNoteComponent } from 'app/modules/admin/sale-note/sale-note.component';
import { ClientInfoComponent } from './create-edit-sale-note/client-info/client-info.component';
import { CreateEditSaleNoteComponent } from './create-edit-sale-note/create-edit-sale-note.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { SaleNoteListComponent } from './list/list.component';
import { CanDeactivateClientInfo } from './sale-note.guards';
import {
    SaleNoteInitialDataResolver,
    SaleNoteListResolver,
} from './sale-note.resolvers';

export const saleNoteRoutes: Route[] = [
    {
        path: '',
        component: SaleNoteComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: SaleNoteListComponent,
                resolve: {
                    saleNotes: SaleNoteListResolver,
                },
            },
            {
                path: 'new',
                component: CreateEditSaleNoteComponent,
                resolve: {
                    saleNoteInitalData: SaleNoteInitialDataResolver,
                },
            },
            {
                path: 'edit/:id',
                component: CreateEditSaleNoteComponent,
                resolve: {
                    saleNoteInitalData: SaleNoteInitialDataResolver,
                },
                children: [
                    {
                        path: 'client',
                        component: ClientInfoComponent,
                        canDeactivate: [CanDeactivateClientInfo],
                    },
                ],
            },
            {
                path: 'print/:id',
                component: InvoiceComponent,
            },
        ],
    },
];
