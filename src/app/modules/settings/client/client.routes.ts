import { inject } from '@angular/core';
import { ClientComponent } from './client.component';
import { ClientsService } from './client.service';

export default [
    {
        path     : '',
        component: ClientComponent,
        resolve  : {
            clients: () => inject(ClientsService).listClient(),
        },
    }
];
