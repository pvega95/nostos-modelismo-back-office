import { ClientsService } from './clients.service';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseUtilsService } from '../../../../../@fuse/services/utils/utils.service';
import { ClientPresenter } from './clients.presenter';


@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styles: [
           /* language=SCSS */
           `
           .inventory-grid {
               grid-template-columns: 48px auto 40px;

               @screen sm {
                   grid-template-columns: 48px auto 112px 72px;
               }

               @screen md {
                   grid-template-columns: 14rem 14rem 6rem 12rem 8rem;
               }

               @screen lg {
                   grid-template-columns: 14rem 14rem 6rem 12rem 8rem;
               }
           }
       `
  ],
  animations     : fuseAnimations,
  providers: [ClientPresenter],
})
export class ClientsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  public clients: any[]=[];
  public clientsFiltered: any[]=[];
  public isLoading: boolean;
  public idClient: string;

  flashMessage: boolean;

  searchInputControl: FormControl = new FormControl();
  selectedClient: any = null;
  selectedClientForm: FormGroup;
  tagsEditMode: boolean = false;
  public seeMessage: boolean = false;
  public successMessage: string;
  public unsubscribe$: Subject<boolean> = new Subject();

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public clientPresenter: ClientPresenter,
    private clientsService: ClientsService,
    private fuseUtilsService: FuseUtilsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: FormBuilder
    ) { 
        this.idClient = null;
    }

  ngOnInit(): void {
    this.successMessage = '';
    this.cargarLista();
   // this.initForm();
    // Subscribe to search input field value changes
    this.searchInputControl.valueChanges
    .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((queryInput) => {
            this.closeDetails();
            this.isLoading = true;
            const query = (queryInput as string).toLowerCase();
  /*           let val = this.clients.filter((client)=>{
                console.log('query 2', query)     
                return (client.full_name.name as string).match(query)  || (client.full_name.lastName as string).match(query)
            });
            console.log('val', val) */
          return this.clientsFiltered = this.clients.filter((client)=>{
                return (client.full_name.name as string).toLowerCase().match(query)  || (client.full_name.lastName as string).toLowerCase().match(query)
                        || (client.email as string).toLowerCase().match(query) || (client.phone as string).match(query)
           });
            //return this._inventoryService.getProducts(0, 10, 'name', 'asc', query);
        }),
        map(() => {
            this.isLoading = false;
        })
    )
    .subscribe(); 

    this.fuseUtilsService.getIdClient().pipe(takeUntil(this.unsubscribe$))
    .subscribe((idClientout: string) => {
        this.idClient = idClientout;      
    });
  }



  async cargarLista(){
    let resp: any;
    this.isLoading = true;
    // console.log('lista product', await this.productsService.listarProductos())
    resp = await this.clientsService.listarClientes();
    if(resp.ok){
      // Get the products
      this.clients = resp.data;
      this.clientsFiltered = this.clients;
      this.isLoading = false;
      if (this.clients.length > 0 && this.idClient) {
            this.toggleDetails(this.idClient);
      }
    //  console.log('lista clients',resp.data);
    }
   }

   toggleDetails(clientId: string, open?: boolean): void
   { 
     //  console.log('selectedClient', this.selectedClient);

       // If the product is already selected...
       if (this.selectedClient ) {
         if (this.selectedClient.uid === clientId )
         {
             // Close the details
             this.clientPresenter.resetClientForm();
             this.closeDetails();
             return;
         }
       }
       this.successMessage = '';
       this.seeMessage = false;

       // Get the client by id
       const clienteEncontrado = this.clients.find(item => item.uid === clientId)  || null;
       this.selectedClient = clienteEncontrado;

       if (clienteEncontrado.uid) {
           this.clientPresenter.loadClientForm(clienteEncontrado);
       } else {
           this.clientPresenter.resetClientForm();
       }
       this.clientPresenter.verifyLongArrayBillingAddressForm();     

      // this.stringToDate(clienteEncontrado.createdAt);


   //    console.log('fecha', this.formatDate(this.stringToDate(clienteEncontrado.createdAt)));
       
   }

   updateSelectedClient(uid: string){
       const body = this.clientPresenter.createClientBody();
       this.isLoading = true;
       if (body) {
        this.clientsService.actualizarCliente(body,uid).then((resp)=>{
            this.flashMessage = resp.success;
            this.seeMessage = true;
     
            if (resp.success) {
                this.successMessage = resp.message;
                this.isLoading = false;
                setTimeout(()=>{  // 2 segundo se cierra 
                    this.seeMessage = false;
                    }, 2000);

                setTimeout(()=>{  
                    this.cargarLista();
                    this.closeDetails();
                    }, 1000); 
                
            }
        });
       }

   }
   createNewClient(){
    const body = this.clientPresenter.createClientBody();
 
    this.isLoading = true;
    if (body) {
        
        this.clientsService.crearCliente(body).then((resp)=>{
            console.log('resp', resp)
            
            this.flashMessage = resp.ok;
            this.seeMessage = true;
    
            if (resp.ok) {
                this.successMessage = 'Cliente creado';
                this.isLoading = false;
                setTimeout(()=>{  // 2 segundo se cierra 
                    this.seeMessage = false;
                    }, 2000);
                setTimeout(()=>{  
                    this.cargarLista();
                    this.closeDetails();
                    }, 1000); 
                
            }
        });
    }
                
    
   }


  deleteSelectedClient(uid: any): void{
      if (uid == -1) {
        this.clients = this.clients.filter((client) => client._id !== -1);
        this.clientsFiltered = this.clients;
      } else {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
        title  : 'Eliminar cliente',
        message: '¿Estás seguro(a) que quieres eliminar este cliente?. Esta acción no puede deshacerse!',
        actions: {
            confirm: {
                label: 'Eliminar'
            }
        }
        });
        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe(async (result) => {
        // If the confirm button pressed...
        if ( result === 'confirmed' )
        {
            let resp;          
            this.isLoading = true;
            // Delete the client on the server
            resp = await this.clientsService.eliminarCliente(uid);
            this.flashMessage = resp.success; 
            this.seeMessage = true;
            if (resp.success) {
              this.successMessage = resp.message;
              this.isLoading = false;
              setTimeout(()=>{  // 2 segundo se cierra 
                  this.seeMessage = false;
                  }, 2000);
              setTimeout(()=>{  
                  this.cargarLista();
                  this.closeDetails();
                  }, 1000); 
          }
            
            }
        });
      }

  }

   closeDetails(): void
   {
       this.selectedClient = null;
    //   this.initForm();
   }

   ngAfterViewInit(): void
   {
       if ( this._sort && this._paginator )
       {
           // Set the initial sort
           this._sort.sort({
               id          : 'name',
               start       : 'asc',
               disableClear: true
           });

           // Mark for check
           this._changeDetectorRef.markForCheck();

           // If the user changes the sort order...
           this._sort.sortChange
               .pipe(takeUntil(this._unsubscribeAll))
               .subscribe(() => {
                   // Reset back to the first page
                   this._paginator.pageIndex = 0;

                   // Close the details
                   this.closeDetails();
               });

           // Get products if sort or page changes
     /*       merge(this._sort.sortChange, this._paginator.page).pipe(
               switchMap(() => {
                   this.closeDetails();
                   this.isLoading = true;
                   return this._inventoryService.getProducts(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction);
               }),
               map(() => {
                   this.isLoading = false;
               })
           ).subscribe(); */
       }
   }
   ngOnDestroy(): void
   {
      this.unsubscribe$.next(true);
      this.unsubscribe$.complete();
      this.fuseUtilsService.setIdClient(null);

       // Unsubscribe from all subscriptions
       this._unsubscribeAll.next();
       this._unsubscribeAll.complete();
   }
   createClient(){
    this.clients.unshift({
        _id: -1,
        full_name: {
            name: '',
            lastName: ''
        },
        phone: '',
        email: ''
    });
    this.clientsFiltered = this.clients;
   }

}
