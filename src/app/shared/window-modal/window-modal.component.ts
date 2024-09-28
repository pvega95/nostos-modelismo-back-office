import { Component, OnInit, Inject, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Modal } from '../../enum/modal.enum';
/* import { ProductsService } from '../../modules/admin/setting/products/products.service';
import { ClientsService } from '../../modules/admin/setting/clients/clients.service'; */
//import { OrdersService } from '../../modules/admin/order/order.service';
import { FuseUtilsService } from '../../../@fuse/services/utils/utils.service';
import { MatSelect } from '@angular/material/select';
import { Select } from 'app/models/select';
import { Router } from '@angular/router';
import { Product } from 'app/models/product';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { VoucherDetail } from 'app/models/voucher-detail';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from '../services/common.service';



@Component({
  selector: 'app-window-modal',
  templateUrl: './window-modal.component.html',
  styleUrls: ['./window-modal.component.scss']
})
export class WindowModalComponent implements OnInit {
  public existListFile: boolean = false;
  public typeModal: any;
  public listFiles: File[] = [];
  public orderForm: FormGroup;
  public products: Product[];
  public productsAdded: Product[];
  public clients: any[];
  public addressClient: any[];
  public isLoading: boolean = true;
  public success: boolean;
  public isLoadingAddressClient: boolean = false;
  public listObjClient: Select[];
  public listObjAddressClient: Select[];
  public listObjProduct: Select[];
  public clientAvailableSearch: boolean = true;
  public productAvailableSearch: boolean = true;
  public totalAmount: number = 0;
  public disableRemoveProduct: boolean;
  public displayedColumns: string[] = ['select','sku', 'name', 'listprice'];
  public dataSource = new MatTableDataSource<any>([]);
  //public selection = new SelectionModel<any>(true, []);
  public selection: any[] =[];

  constructor(
    private _formBuilder: FormBuilder,
/*     private productsService: ProductsService,
    private clientsService: ClientsService,
    private ordersService: OrdersService, */
    public router: Router,
    public dialogRef: MatDialogRef<WindowModalComponent>,
    private fuseUtilsService: FuseUtilsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.typeModal = Modal;
  }

  ngOnInit(): void {
    this.disableRemoveProduct = true;
    this.productsAdded = [];
    if (this.data.type === this.typeModal.newOrder) {
      this.loadData();
    }
    if (this.data.type === this.typeModal.newItem) {
      //this.loadItems();
    }
    this.initForm();
  }

  applyFilterItem(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  itemSelected(val: MatCheckboxChange, sku: string){
    if (val.checked) {
      this.products.forEach(product => {
        if (product.sku === sku) {
          this.productsAdded.push(product);
        }
      });
    }else{
      this.productsAdded = this.productsAdded.filter( product => product.sku !== sku);
    }
  }
/*   loadItems(){
    this.productsService.getListProducts().subscribe(resp=>{
      if (resp.ok) {
        
        resp.data = resp.data.map( x =>{ 
          const {selected, checked} = this.verifyItemSelected( this.data.voucherDetail, x.sku);
           x.selected = selected;
           x.checked = checked;
          return x;
        });
    //    console.log('resp.data',this.data.voucherDetail,  resp.data)
        this.dataSource = new MatTableDataSource<any>(resp.data);
      
        this.isLoading = false;
      }
    });
  } */
  verifyItemSelected(voucherDetail: VoucherDetail[], sku: string): {selected: boolean, checked: boolean} {
    let selected: boolean = false;
    let checked: boolean = false;
    voucherDetail.forEach(voucher => {
      if (voucher.sku === sku) {
        selected = true;
        checked = true;
        this.selection.push(voucher);
        //console.log('this.selection.', voucher, this.selection)
      }
    });
    return {selected, checked};
  }

  async loadData(): Promise<void> {
    let resp1: any;
    let resp2: any;
    this.products = [];
    this.clients = [];
    this.listObjClient = [];
    this.listObjProduct = [];
    this.listObjAddressClient = [];
    this.success = false;
   // resp1 = await this.productsService.getListProducts();
   // resp2 = await this.clientsService.listarClientes();

    if (resp1.ok && resp2.ok) {
      //console.log(resp2)
      // Get the products and clients
      this.products = this.formatProduct(resp1.data);
      this.clients = this.formatClient(resp2.data);
      this.isLoading = false;
      if (this.clients.length > 0) {
        this.clients.forEach(element => {
          this.listObjClient.push({
            id: element.id,
            label: element.fullName,
            data:
            {
              address: element.address
            }
          });
        });
      }
      if (this.products.length > 0) {
        this.products.forEach(element => {
          this.listObjProduct.push({
            id: element._id as string,
            label: element.name,
            data:
            {
              sku: element.sku,
              price: element.grossPrice
            }
          });
        });
      }
      this.addProduct();
      //console.log(' this.products ',  this.products, this.clients )

      this.orderForm.valueChanges.subscribe(val => {
        this.calculateTotalAmmount();
      });
    }
  }
  objClientSelected(objClient: Select) {
    const { address } = objClient.data;
    this.orderForm.patchValue({
      clientSelected: objClient.id as string
    });
    this.consultAddressClient(address);
  }

  consultAddressClient(address: Array<any>) {
    this.addressClient = [];
    this.listObjAddressClient = [];

    this.addressClient = this.formatAddressClient(address);
    if (this.addressClient.length > 0) {
      this.addressClient.forEach(element => {
        this.listObjAddressClient.push({
          id: element.id,
          label: element.address
        });
      });
    }
  }

  formatAddressClient(AddressClientRaw) {
    let list: any[] = [];
    AddressClientRaw.forEach(element => {
      list.push({
        id: element._id,
        address: element.address
      });
    });
    return list;


  }

  objProductSelected(objProduct: Select, i: number) {
    this.productsControls[i].patchValue({
      product: objProduct,
      price: objProduct.data.price.toFixed(2)

    });
    // console.log('precioo', objProduct.data.price.toFixed(2))
    // this.calculateTotalAmmount();
  }
  objAddressSelected(objProduct: Select) {
    this.orderForm.patchValue({
      address: objProduct.id
    });
  }

  calculateTotalAmmount(): void {
    let cal: number = 0;
    this.totalAmount = 0;
    this.productsForm.value.forEach((productForm, index) => {

      if (productForm.product.data) {
        cal = productForm.quantity * productForm.product.data.price;
        this.totalAmount += cal;
      }
    });
  }

  initForm(): void {
    this.orderForm = this._formBuilder.group({
      clientSelected: new FormControl(null, Validators.required),
      address: new FormControl('', Validators.required),
      products: new FormArray([]),
    });
  }
  get productsForm() {
    return this.orderForm.get('products') as FormArray;
  }
  addProduct(): void {
  //  console.log('se agrego rpdocuto')
    const formProduct = this.createProductForm();
    this.productsForm.push(formProduct);
    this.verifyQuantityLot();
  }
  removeProduct(): void {
    this.productsForm.removeAt(this.productsForm.length - 1);
    this.verifyQuantityLot();
  }
  addItem(): void{
    this.dialogRef.close(this.selection);
  }
  verifyQuantityLot() {
    if (this.productsForm.length === 1) {
      this.disableRemoveProduct = true;
    } else {
      this.disableRemoveProduct = false;
    }
  }
  createProductForm(): FormGroup {
    return new FormGroup({
      product: new FormControl('', Validators.required),
      price: new FormControl(),
      quantity: new FormControl(1, Validators.required)
    });
  }
  get productsControls() {
    return this.productsForm.controls as FormGroup[];
  }

  onNoClick(): void {
    this.listFiles = [];
    this.dialogRef.close(this.listFiles);
  }
  imagenesCargadas(): void {
    this.dialogRef.close(this.listFiles);
  }
  getFilesLoades(files: File[]): void {
    console.log('files', files)
    if (files.length > 0) {
      this.existListFile = true;
      this.listFiles = files;
    } else {
      this.existListFile = false;
      this.listFiles = [];
    }
  }



  formatClient(clientRaw) {
    let lista: any[] = [];
    clientRaw.forEach(element => {
      lista.push({
        id: element.uid,
        fullName: element.full_name.name + ' ' + element.full_name.lastName,
        address: element.billing_address
      });
    });
    return lista;
  }

  formatProduct(productRaw) {
    let lista: any[] = [];
    productRaw.forEach(element => {
      lista.push({
        id: element._id,
        sku: element.sku,
        name: element.name,
        price: element.price
      });
    });
    return lista;
  }
  listClientAvailable(val: boolean): void {
    this.clientAvailableSearch = val;
  }
  listProductAvailable(val: boolean): void {
    this.productAvailableSearch = val;
  }
  goToClient(idClient?: string): void {
    if (idClient) {
      this.fuseUtilsService.setIdClient(idClient);
    }

    this.router.navigate(['setting/clients']);
    this.dialogRef.close();
  }
/*   async createNewOrder(): Promise<void> {
    let idClient: string;
    let address: string;
    let ammount: number = 0;
    let productsList: any[] = [];
    let resp: any;

    idClient = this.orderForm.controls.clientSelected.value
    address = this.orderForm.controls.address.value
    //console.log('client', this.orderForm.controls.clientSelected.value)
    //console.log('products', this.productsForm.value)
    this.productsForm.value.forEach(productForm => {
      // console.log(productForm.product.id, productForm.quantity)
      productsList.push({
        productId: productForm.product.id,
        sku: productForm.product.data.sku,
        quantity: productForm.quantity,
        price: productForm.product.data.price,
        totalCost: productForm.quantity * productForm.product.data.price
      })
      ammount += productForm.quantity * productForm.product.data.price;
    });
    const body = {
      customer_id: idClient,
      ammount,
      address,
      products: productsList
    }
    console.log('body', body)
    this.isLoading = true;
    resp = await this.ordersService.crearOrden(body);
    if (resp.ok) {
      this.isLoading = false;
      // console.log('se ha reacdo nueva orden')
      this.success = true;
      setTimeout(() => {
        this.dialogRef.close();
      }, 1000);

    }

  } */

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  hasValue(){
    if(this.selection.length > 0){
      return true;
    }else{
      return false;
    }
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
    //  this.selection.clear();
   // console.log('this.dataSource.data', this.dataSource.data)
    this.dataSource.data.forEach(element => {
      if (!element.selected && element.checked) {
        element.checked = false;
      } 
    }); 
    this.selection = [];
      return;
    }
    this.dataSource.data.forEach(element => {
      if (!element.selected && !element.checked) {
        element.checked = true;
      } 
    }); 
    this.selection.push(...this.dataSource.data);
  }
  toggleItem(product: Product){
    const index =  this.selection.findIndex(obj=> obj.sku ==  product.sku);
   // console.log('product', product, index)
    if (index !== -1) {
      this.selection.splice(index, 1);// quita elemento de lista
    } else {
      this.selection.push(product);//agrega elemento de lista
    }
    const index2 = this.dataSource.data.findIndex(obj=> obj.sku ==  product.sku);
      this.dataSource.data[index2].checked = !this.dataSource.data[index2].checked // desmarca elemento de lista
  }

  /** The label for the checkbox on the passed row */
/*   checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  } */


}
