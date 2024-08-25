import { Routes } from '@angular/router';
import { SalesService } from './sales.service';
import { inject } from '@angular/core';
import { SalesComponent } from './sales.component';

export default [
    {
        path: '',
        component: SalesComponent,
        resolve: {
            brands: () => inject(SalesService).getSales(),
        }
    },
] as Routes;
