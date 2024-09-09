import { Routes } from '@angular/router';
import { SalesService } from './sales.service';
import { inject } from '@angular/core';
import { SalesComponent } from './sales.component';
import { SalesCreateUpdateComponent } from './create-update/sales-create-update.tcomponen';
import { SalesListComponent } from './list/sales-list.component';
import { CompanyService } from 'app/modules/settings/company/company.service';
import { DocumentService } from 'app/modules/settings/document/document.service';
import { PaymentDeadlineService } from 'app/modules/settings/payment-deadline/payment-deadline.service';
import { PaymentMethodService } from 'app/modules/settings/payment-method/payment-method.service';

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
                resolve  : {
                    companies: () => inject(CompanyService).getListCompany(),
                    documents: () => inject(DocumentService).getListDocument(),
                    paymentDeadlines: () => inject(PaymentDeadlineService).getListPaymentDeadline(),
                    paymentMethods: () => inject(PaymentMethodService).getListPaymentMethod(),
                },
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
