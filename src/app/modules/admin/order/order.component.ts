import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { FuseUtilsService } from '../../../../@fuse/services/utils/utils.service';
import { OrderService } from './order.service';
// import { StatusOrder } from '../../../enums/status.enum';
import { MatDialog } from '@angular/material/dialog';
// import { WindowModalComponent } from '../../../shared/window-modal/window-modal.component';
// import { Modal } from '../../../enums/modal.enum';
import { AsyncPipe, DOCUMENT, I18nPluralPipe, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Order } from './order.types';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  // styleUrls: [ './order.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    AsyncPipe
  ],
})
export class OrderComponent implements OnInit {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;
  public orders: any[];
  public ordersFiltered: any[];
  public statusOrders: any[];
//   public products: any[];
  public isLoading: boolean;
  public orderStatusSelected: string;
  public flashMessage: boolean;
  public seeMessage: boolean = false;
  selectedOrder: any = null;
  selectedOrderForm: FormGroup;
  selected: number;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  searchInputControl: UntypedFormControl = new UntypedFormControl();

  // MIGRATION

  products$: Observable<Order[]>;

  constructor(
      private _orderService: OrderService,
      private fuseUtilsService: FuseUtilsService,
      private _changeDetectorRef: ChangeDetectorRef,
      public dialog: MatDialog,
      private _fuseConfirmationService: FuseConfirmationService,
      private _formBuilder: FormBuilder,
      @Inject(DOCUMENT) private _document: any,
  ) {}

  ngOnInit(): void {
    // Get the products
    this.products$ = this._orderService.products$;
      this.cargarLista();
      this.searchInputControl.valueChanges
          .pipe(
              takeUntil(this._unsubscribeAll),
              debounceTime(300),
              switchMap((queryInput) => {
                  this.closeDetails();
                  this.isLoading = true;
                  const query = (queryInput as string).toLowerCase();
                  return (this.ordersFiltered = this.orders.filter(
                      (order) => {
                          return (
                              (order.order_status.name as string)
                                  .toLowerCase()
                                  .match(query) ||
                              (order.customer_id.full_name.name as string)
                                  .toLowerCase()
                                  .match(query) ||
                              (order.customer_id.full_name.lastName as string)
                                  .toLowerCase()
                                  .match(query) ||
                              (order.ammount as number)
                                  .toString()
                                  .match(query)
                          );
                      }
                  ));
              }),
              map(() => {
                  this.isLoading = false;
              })
          )
          .subscribe();

      /*   this.dialog.open(WindowModalComponent, {
    data: {
            type: Modal.success
        },
    disableClose: true
  });  */

      /*     setTimeout(()=>{  // 3 segundo se cierra modal
    this.dialog.closeAll();
}, 3000); */
  }

  async cargarLista() {
      let resp1: any;
      let resp2: any;

    //   this.products = [];
      this.orders = [];
      this.ordersFiltered = [];
      this.statusOrders = [];
      this.isLoading = true;

    //   resp1 = await this.ordersService.listarOrdenes();
      resp2 = await this._orderService.listarEstadosOrdenes();

      if (resp1.ok && resp2.ok) {
          // Get the ordersn
          this.orders = resp1.data;
          this.ordersFiltered = this.orders;
          this.statusOrders = resp2.data;
          this.isLoading = false;
      }
  }

  addNewOrder(): void {
    //   const dialogRef = this.dialog.open(WindowModalComponent, {
    //       width: '42rem',
    //       height: '30rem',
    //       data: {
    //           // type: Modal.newOrder
    //       },
    //       disableClose: true,
    //   });
    //   dialogRef.afterClosed().subscribe((result) => {
    //       this.cargarLista();
    //       this.closeDetails();
    //   });
  }

  toggleDetails(orderId: string, open: boolean): void {
      // If the order is already selected...
      if (this.selectedOrder) {
          if (this.selectedOrder._id === orderId) {
              // Close the details
              this.closeDetails();
              return;
          }
      }
      this.initForm();
      this.seeMessage = false;

      // Get the order by id
      const orderEncontrado =
          this.orders.find((item) => item._id === orderId) || null;

      this.selectedOrder = orderEncontrado;
      if (orderEncontrado._id) {
        //   this.products = [];
          this.selectedOrderForm.patchValue({
              id: orderEncontrado._id,
              name: orderEncontrado.name,
              sku: orderEncontrado.sku,
              category: orderEncontrado.category,
          });
        //   this.products = orderEncontrado.products;
          this.orderStatusSelected = orderEncontrado.order_status._id;
      } else {
          let descriptions = [''];
          this.selected = -1;
          this.selectedOrderForm.patchValue({
              id: -1,
              name: '',
              sku: '',
              category: '',
              stock: '',
              images: '',
              price: '',
              weight: '',
          });
      }
  }
  async updateselectedOrder(idOrder: string): Promise<void> {
      let resp;
      const body = {
          order_status: this.orderStatusSelected,
      };
      this.isLoading = true;
      resp = await this._orderService.editarEstadoOrden(idOrder, body);
      this.seeMessage = true;
      this.flashMessage = resp.success;
      if (resp.success) {
          this.isLoading = false;
      }
      setTimeout(() => {
          // 3 segundo se cierra modal
          this.seeMessage = false;
      }, 2000);

      setTimeout(() => {
          this.cargarLista();
          this.closeDetails();
      }, 1000);
  }

  initForm() {
      this.selectedOrderForm = this._formBuilder.group({
          id: [''],
          category: [''],
          name: ['', [Validators.required]],
          descriptions: this._formBuilder.array([]),
          createdDate: [''],
          updatedDate: [''],
          tags: [[]],
          sku: [''],
          barcode: [''],
          brand: [''],
          vendor: [''],
          stock: [''],
          reserved: [''],
          cost: [''],
          basePrice: [''],
          taxPercent: [''],
          price: [''],
          weight: [''],
          thumbnail: [''],
          images: [[]],
          currentImageIndex: [0], // Image index that is currently being viewed
          active: [false],
      });
  }
  closeDetails(): void {
      this.selectedOrder = null;
  }
  formatoFecha(fecha: string): string {
      return '';
      // return this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(fecha))
  }
}
