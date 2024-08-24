import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ClientInfoComponent } from './create-edit-sale-note/client-info/client-info.component';

@Injectable({
    providedIn: 'root'
})
export class CanDeactivateClientInfo implements CanDeactivate<ClientInfoComponent>
{
    canDeactivate(
        component: ClientInfoComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
        
        // Get the next route
        let nextRoute: ActivatedRouteSnapshot = nextState.root;
        while ( nextRoute.firstChild )
        {
            nextRoute = nextRoute.firstChild;
        }

        // If the next state doesn't contain '/client'
        // it means we are navigating away from the
        // contacts app
        if ( !nextState.url.includes('/client') )
        {
            // Let it navigate
            return component.closeDrawer().then(() => true);
        }
    }
}
