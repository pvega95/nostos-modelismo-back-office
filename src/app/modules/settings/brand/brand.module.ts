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
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IMaskModule } from 'angular-imask';
import { TranslocoModule } from '@ngneat/transloco';
import { BrandComponent } from './brand.component';
import { brandRoutes } from './brand.routing';
import { DatePipe } from '@angular/common';

@NgModule({
    declarations: [
        BrandComponent
    ],
    imports     : [
        RouterModule.forChild(brandRoutes),
        MatInputModule,
        MatProgressSpinnerModule,
        IMaskModule,
        MatFormFieldModule,
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
    providers: [
        DatePipe
    ]
})
export class BrandModule
{
}
