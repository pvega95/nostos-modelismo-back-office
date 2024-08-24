import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboards/analytics'
    {path: '', pathMatch : 'full', redirectTo: 'dashboards/analytics'},

    // Redirect signed in user to the '/dashboards/analytics'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'dashboards/analytics'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)}
        ]
    },

    // Landing routes
    {
        path: '',
        component  : LayoutComponent,
        data: {
            layout: 'empty'
        },
        children   : [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
        ]
    },

    // Admin routes
    {
        path       : '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [

            // Dashboards
            {path: 'dashboards', children: [
              //  {path: 'project', loadChildren: () => import('app/modules/admin/dashboards/project/project.module').then(m => m.ProjectModule)},
                {path: 'analytics', loadChildren: () => import('app/modules/admin/dashboards/analytics/analytics.module').then(m => m.AnalyticsModule)},
            ]},
            {path: 'order', children: [
                {path: '', loadChildren: () => import('app/modules/admin/order/order.module').then(m => m.OrderModule)}
            ]},
            {path: 'salenote', children: [
                {path: '', loadChildren: () => import('app/modules/admin/sale-note/sale-note.module').then(m => m.SaleNoteModule)}
            ]},
            {path: 'invoice', children: [
                {path: '', loadChildren: () => import('app/modules/admin/invoice/invoice.module').then(m => m.InvoiceModule)}
            ]},
            {path: 'setting', children: [
                {path: 'products', loadChildren: () => import('app/modules/admin/setting/products/products.module').then(m => m.ProductsModule)},
                {path: 'clients', loadChildren: () => import('app/modules/admin/setting/clients/clients.module').then(m => m.ClientsModule)},
               // {path: 'options', loadChildren: () => import('app/modules/admin/setting/options/options.module').then(m => m.OptionsModule)},
                {path: 'categories', loadChildren: () => import('app/modules/admin/setting/category/category.module').then(m => m.CategoriesModule)},
                {path: 'company', loadChildren: () => import('app/modules/admin/setting/company/company.module').then(m => m.CompanyModule)},
                {path: 'document', loadChildren: () => import('app/modules/admin/setting/document/document.module').then(m => m.DocumentModule)},
                {path: 'documentseries', loadChildren: () => import('app/modules/admin/setting/document-series/document-series.module').then(m => m.DocumentSeriesModule)},
                {path: 'paymentdeadline', loadChildren: () => import('app/modules/admin/setting/payment-deadline/payment-deadline.module').then(m => m.PaymentDeadlineModule)},
                {path: 'paymentmethod', loadChildren: () => import('app/modules/admin/setting/payment-method/payment-method.module').then(m => m.paymentMethodModule)},
                {path: 'typedocument', loadChildren: () => import('app/modules/admin/setting/type-document/type-document.module').then(m => m.typeDocumentModule)},
                {path: 'brand', loadChildren: () => import('app/modules/admin/setting/brand/brand.module').then(m => m.BrandModule)},
                {path: 'unid', loadChildren: () => import('app/modules/admin/setting/unid/unid.module').then(m => m.UnidModule)},
                {path: 'payment-gateway', loadChildren: () => import('app/modules/admin/setting/payment-gateway/payment-gateway.module').then(m => m.PaymentGatewayModule)},
            ]},
            // 404 & Catch all
            {path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then(m => m.Error404Module)},
            {path: '**', redirectTo: '404-not-found'}
        ]
    }
];
