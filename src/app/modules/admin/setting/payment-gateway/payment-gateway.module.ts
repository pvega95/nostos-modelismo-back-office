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
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { PaginatorIntl } from 'app/shared/services/paginator-intl.service';
import { WalletComponent } from './wallet/wallet.component';
import { paymentGatewayRoutes } from './payment-gateway.routing';
import { PaymentGatewayComponent } from './payment-gateway.component';
import { AccountBankComponent } from './account-bank/account-bank.component';

@NgModule({
    declarations: [
        PaymentGatewayComponent,
        WalletComponent,
        AccountBankComponent
    ],
    imports     : [
        RouterModule.forChild(paymentGatewayRoutes),
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
        NgApexchartsModule,
        SharedModule
    ],
    providers :[
        {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
        {provide: MatPaginatorIntl, useClass: PaginatorIntl},
    ]
})
export class PaymentGatewayModule
{
}
