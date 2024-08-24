import { Route } from '@angular/router';
import { ProductsComponent } from 'app/modules/admin/setting/products/products.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductChooseOptionComponent } from './product-choose-option/product-choose-option.component';
import { ProductsListComponent } from './product-list/product-list.component';
import { ProductTemplateComponent } from './product-template/product-template.component';

export const productsRoutes: Route[] = [
    {
        path     : '',
        component: ProductsComponent,
        children : [
            {
                path     : '',
                pathMatch: 'full',
                component: ProductsListComponent,
            },
            {
                path     : 'new',
                component: ProductChooseOptionComponent,
            },
            {
                path     : 'add',
                component: ProductAddComponent,
            },
            {
                path     : 'edit/:id',
                component: ProductAddComponent,
            },
            {
                path     : 'upload',
                component: ProductTemplateComponent
            }
        ]
    }
];
