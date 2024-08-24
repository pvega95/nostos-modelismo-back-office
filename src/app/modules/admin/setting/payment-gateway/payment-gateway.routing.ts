import { Route } from '@angular/router';
import { AccountBankComponent } from './account-bank/account-bank.component';
import { PaymentGatewayComponent } from './payment-gateway.component';
import { WalletComponent } from './wallet/wallet.component';

export const paymentGatewayRoutes: Route[] = [
    {
        path     : '',
        component: PaymentGatewayComponent,
        children : [
            {
                path     : 'wallet',
                component: WalletComponent,
            },
            {
                path     : 'account-bank',
                component: AccountBankComponent,
            },
        ]
    }
];
