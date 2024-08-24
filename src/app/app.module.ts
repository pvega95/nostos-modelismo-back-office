import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { appRoutes } from 'app/app.routing';
import { LoadingServicesInterceptor } from './interceptor/loading-services.interceptor';
import Amplify, { Auth } from 'aws-amplify';

Amplify.configure({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Auth: {
        mandatorySignIn: true,
        region: 'us-east-2',
        userPoolId: 'us-east-2_qLnu2w1zD',
        userPoolWebClientId: '5lar7ev64kpu06l5bjto5mnitk',
        authenticationFlowType: 'USER_PASSWORD_AUTH'
    }
});

const routerConfig: ExtraOptions = {
    preloadingStrategy       : PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({})
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: LoadingServicesInterceptor, multi: true },
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
