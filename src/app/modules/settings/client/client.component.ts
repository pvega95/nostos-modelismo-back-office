import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { Observable } from "rxjs";
import { ClientsService } from "./client.service";
import { MatDialog } from "@angular/material/dialog";
import { ClientPresenter } from "./client.presenter";
import Client from "./client";
import { FuseConfirmationService } from "@fuse/services/confirmation";

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    standalone: true,
    imports: [
        RouterModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ],
    providers: [ClientPresenter],
    styles: [
        /* language=SCSS */
        `
        .inventory-grid {
            grid-template-columns: 48px auto 40px;

            @screen sm {
                grid-template-columns: 48px auto 112px 72px;
            }

            @screen md {
                grid-template-columns: 48px 112px auto 112px 72px;
            }

            @screen lg {
                grid-template-columns: repeat(6, 1fr) 112px;
            }
        }
        `,
    ],

})
export class ClientComponent implements OnInit {
    searchInputControl: FormControl = new FormControl();
    isLoading: boolean = false;
    clients$: Observable<any[]>;
    selectedClient: any = null;
    flashMessage: 'success' | 'error' | null = null;
    // selectedClientForm: FormGroup;
    public seeMessage: boolean = false;
    public successMessage: string;
    public clients: any[] = [];

    constructor(
        private _clientService: ClientsService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        public clientPresenter: ClientPresenter,
        public dialog: MatDialog,
    ) { }

    ngOnInit(): void {
        // Get the clients
        this.clients$ = this._clientService.clients$;
    }

    /**
       * Track by function for ngFor loops
       *
       * @param index
       * @param item
       */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {
            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    addNewClient() {
        this._clientService.addNewClient().subscribe((client) => {
            // Go to new product
            this.selectedClient = client;
            // Fill the form
            this.clientPresenter.loadClientForm(client)
            // Mark for check
            this._changeDetectorRef.markForCheck();
        })
    }

    createNewClient(){
        // Get the product object
        const clientForm = this.clientPresenter.form.getRawValue();
        const client = new Client(clientForm)
        delete client.uid;
        client.setFullName(clientForm)
        console.log(client)
        // Remove the currentImageIndex field
        console.log('createNewClient client', client)
        // Update the client on the server
        this._clientService
            .createClient(client)
            .subscribe(() => {
                // Show a success message
                console.log('success')
                this.showFlashMessage('success');
            });
    }

    closeDetails(): void {
        this.selectedClient = null;
        //   this.initForm();
    }

    toggleDetails(clientUid: string): void {
        // If the product is already selected...
        if (this.selectedClient && this.selectedClient.uid === clientUid) {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the product by id
        this._clientService
            .getClientById(clientUid)
            .subscribe((client) => {
                // Set the selected product
                this.selectedClient = client;

                // Fill the form
                this.clientPresenter.loadClientForm(client)

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

     /**
     * Update the selected client using the form data
     */
     updateSelectedClient(): void {
        // Get the product object
        const client = this.clientPresenter.form.getRawValue();

        // Update the product on the server
        this._clientService
            .updateClient(client.uid, client)
            .subscribe(() => {
                // Show a success message
                this.showFlashMessage('success');
            },() => {
                this.showFlashMessage('error');
            });
    }

    deleteSelectedClient() {
                // Open the confirmation dialog
                const confirmation = this._fuseConfirmationService.open({
                    title: 'Delete product',
                    message:
                        'Are you sure you want to remove this product? This action cannot be undone!',
                    actions: {
                        confirm: {
                            label: 'Delete',
                        },
                    },
                });

                // Subscribe to the confirmation dialog closed action
                confirmation.afterClosed().subscribe((result) => {
                    // If the confirm button pressed...
                    if (result === 'confirmed') {
                        // Get the product object
                        const product = this.clientPresenter.form.getRawValue();

                        // Delete the product on the server
                        this._clientService
                            .deleteClient(product.uid)
                            .subscribe(() => {
                                // Close the details
                                this.closeDetails();
                            });
                    }
                });
    }

}
