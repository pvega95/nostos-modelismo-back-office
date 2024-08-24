import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from 'app/shared/shared.module';
import { productsRoutes } from 'app/modules/admin/setting/products/products.routing';
import { ProductsComponent } from './products.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IMaskModule } from 'angular-imask';
import { TranslocoModule } from '@ngneat/transloco';
import { ProductAddComponent } from './product-add/product-add.component';
import { MatSelectModule } from '@angular/material/select';
import { ProductChooseOptionComponent } from './product-choose-option/product-choose-option.component';
import { ProductsListComponent } from './product-list/product-list.component';
import { ProductTemplateComponent } from './product-template/product-template.component';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { PaginatorIntl } from 'app/shared/services/paginator-intl.service';
@NgModule({
    declarations: [
        ProductsComponent,
        ProductAddComponent,
        ProductsListComponent,
        ProductChooseOptionComponent,
        ProductTemplateComponent
    ],
    imports     : [
        RouterModule.forChild(productsRoutes),
        MatFormFieldModule,
        IMaskModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        MatInputModule,
        MatSelectModule,
        TranslocoModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSortModule,
        MatTableModule,
        MatPaginatorModule,
        MatTooltipModule,
        NgApexchartsModule,
        SharedModule,
    ],
    providers :[
        {provide: MatPaginatorIntl, useClass: PaginatorIntl},
    ]
})
export class ProductsModule
{
}
