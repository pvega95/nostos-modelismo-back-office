import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDrawerToggleResult } from "@angular/material/sidenav";
import { ActivatedRoute } from "@angular/router";
import { Client } from "app/models/client";
import { Delivery } from "app/models/delivery";
import { SaleNoteService } from "../../sale-note.service";
import { CreateEditSaleNoteComponent } from "../create-edit-sale-note.component";

@Component({
    selector       : 'client-info',
    templateUrl    : './client-info.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientInfoComponent implements OnInit, OnDestroy {
    editMode: boolean = false;
    contact: Client;
    delivery: Delivery;
    constructor(
        private _createEditSaleNoteComponent: CreateEditSaleNoteComponent,
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _saleNoteService: SaleNoteService
    ){}

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
         // Open the drawer
         this._createEditSaleNoteComponent.matDrawer.open();

         this._saleNoteService.client$.subscribe(client => {
             this.contact = client;
         });

         this._saleNoteService.delivery$.subscribe(delivery => {
            this.delivery = delivery;
         });
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
     toggleEditMode(editMode: boolean | null = null): void
     {
         if ( editMode === null )
         {
             this.editMode = !this.editMode;
         }
         else
         {
             this.editMode = editMode;
         }
 
         // Mark for check
         this._changeDetectorRef.markForCheck();
     }

     /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._createEditSaleNoteComponent.matDrawer.close();
    }

}