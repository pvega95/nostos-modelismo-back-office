import { OrderComponent } from 'app/modules/admin/order/order.component';

import { Routes } from '@angular/router';
import { OrderService } from './order.service';
import { inject } from '@angular/core';

export default [
    {
        path: '',
        component: OrderComponent,
        resolve: {
            brands: () => inject(OrderService).getOrders(),
        }
    },
] as Routes;
