import { Routes } from '@angular/router';
import { SalesService } from './sales.service';
import { inject } from '@angular/core';
import { SalesComponent } from './sales.component';
import { SalesCreateUpdateComponent } from './create-update/sales-create-update.tcomponen';
import { SalesListComponent } from './list/sales.component';

export default [
    {
        path     : '',
        component: SalesComponent,
        children : [
            {
                path     : '',
                pathMatch: 'full',
                component: SalesListComponent,
                resolve  : {
                    sales: () => inject(SalesService).getSales(),
                },
            },
            {
                path     : 'new',
                component: SalesCreateUpdateComponent,
            },
            {
                path     : 'edit/:id',
                component: SalesCreateUpdateComponent,
            },
            // {
            //     path     : 'print/:id',
            //     component: InvoiceComponent
            // },
        ]
    }
] as Routes;