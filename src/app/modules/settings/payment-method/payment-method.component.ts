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
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethod } from '../../../../models/payment-method';
import { CommonService } from 'app/shared/services/common.service';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styles: [
    /* language=SCSS */
    `
    .inventory-grid {
        grid-template-columns: 48px auto 40px;

        @screen sm {
            grid-template-columns: 48px auto 112px 72px;
        }

        @screen md {
            grid-template-columns: 20rem 12rem 12rem  6rem;
        }

        @screen lg {
            grid-template-columns: 20rem 12rem 12rem  6rem;
        }
    }
  `
  ],
  animations  : fuseAnimations,
})
export class PaymentMethodComponent implements OnInit {
  public paymentMethods: PaymentMethod[] = [];
  public isLoading: boolean;
  paymentMethodsFiltered: any[] = [];
  searchInputControl: FormControl = new FormControl();
  selectedPaymentMethod: any = null;
  selectedPaymentMethodForm: FormGroup;
  flashMessage: boolean;
  seeMessage: boolean = false;
  successMessage: string;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  maskForInput: any = 
  {mask: /^[A-Za-z0-9\s]+$/g
  };

  constructor(
    private fuseUtilsService: FuseUtilsService,
    private paymentMethodService: PaymentMethodService,
    private commonService: CommonService,
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    ) { }

  ngOnInit(): void {
    this.successMessage = '';
    this.loadListPaymentMethod();
    this.searchInputControl.valueChanges
    .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((queryInput) => {
            this.closeDetails();
            this.isLoading = true;
            const query = (queryInput as string).toLowerCase();
          return this.paymentMethodsFiltered = this.paymentMethods.filter((paymentMethod)=>{
                return (paymentMethod.description as string).toLowerCase().match(query) 
           });
        }),
        map(() => {
            this.isLoading = false;
        })
    )
    .subscribe(); 
  }
  loadListPaymentMethod(): void{
    this.isLoading = true;
    this.paymentMethodService.getListPaymentMethod().subscribe((resp)=>{
      if (resp.ok) {
       this.paymentMethods = resp.data;
       this.paymentMethodsFiltered = this.paymentMethods;
       this.isLoading = false;
      }
    });
  }
  toggleDetails(paymentMethodId: string): void
  {
      // If the company is already selected...
      if (this.selectedPaymentMethod ) {
        if (this.selectedPaymentMethod._id === paymentMethodId )
        {
            // Close the details
            this.closeDetails();
            return;
        }
      }
      this.successMessage = '';
      this.seeMessage = false;
      this.initForm();
      // Get the company by id
      const paymentMethodEncontrado = this.paymentMethods.find(item => item._id === paymentMethodId)  || null;
      this.selectedPaymentMethod = paymentMethodEncontrado;
      if(paymentMethodEncontrado._id){
          this.selectedPaymentMethodForm.patchValue({
            _id: paymentMethodEncontrado._id,
            description: paymentMethodEncontrado.description,
            createdDate: paymentMethodEncontrado.createdAt !== '' ?  this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(paymentMethodEncontrado.createdAt)) : '',
            updatedDate: paymentMethodEncontrado.updatedAt !== '' ? this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(paymentMethodEncontrado.updatedAt)) : ''
          });
      }else{
          this.selectedPaymentMethodForm.patchValue({
              _id: '-1',
              description: '',
              createdDate: '',
              updatedDate: ''
            });
      }

  }
  formatoFecha(fecha: string): string{
    return  fecha !== '' ? this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(fecha)) : ''
  }
  initForm() {
    this.selectedPaymentMethodForm = this._formBuilder.group({
        _id               : ['-1'],
        description      : ['', [Validators.required, Validators.minLength(2), FuseUtilsService.sinEspaciosEnBlanco]],
        createdDate      : [''],
        updatedDate      : ['']
    });
    this.selectedPaymentMethodForm.controls.createdDate.disable();
    this.selectedPaymentMethodForm.controls.updatedDate.disable();
  }

  createPaymentMethod(): void{
    this.paymentMethods.unshift(
      {
        _id: '-1',
        description: '',
        createdAt: '',
        updatedAt: ''
      });
      this.paymentMethodsFiltered = this.paymentMethods;
  }
  closeDetails(): void
  {
      this.selectedPaymentMethod = null;
  }
  createNewpaymentMethod(): void{
    const body: PaymentMethod = {
      description: this.selectedPaymentMethodForm.get('description').value,
    } 
    this.isLoading = true;
    if (body) {
      this.paymentMethodService.createPaymentMethod(body).subscribe((resp)=>{
        this.flashMessage = resp.ok;
        this.seeMessage = true;

        if (resp.ok) {
            this.successMessage = resp.message;
            this.isLoading = false;
            setTimeout(()=>{  // 2 segundo se cierra 
                this.seeMessage = false;
                }, 2000);
            setTimeout(()=>{  
                this.loadListPaymentMethod();
                this.closeDetails();
                }, 1000); 
            
        }
      });
    }
  }
  updateSelectedpaymentMethod(): void {
    const body: PaymentMethod = {
      description: this.selectedPaymentMethodForm.get('description').value
    } 
    const id = this.selectedPaymentMethodForm.get('_id').value
    this.isLoading = true;
    if (body) {
      this.paymentMethodService.updatePaymentMethod(id, body).subscribe((resp)=>{
        this.flashMessage = resp.success;
        this.seeMessage = true;
        if (resp.success) {
            this.successMessage = resp.message;
            this.isLoading = false;
            setTimeout(()=>{  // 2 segundo se cierra 
                this.seeMessage = false;
                }, 2000);
            setTimeout(()=>{  
                this.loadListPaymentMethod();
                this.closeDetails();
                }, 1000); 
        }
      });
    }

  }
  deleteSelectedpaymentMethod(): void {
    if (this.selectedPaymentMethodForm.get('_id').value === '-1') {
      this.paymentMethods = this.paymentMethods.filter((paymentMethod) => paymentMethod._id !== '-1');
      this.paymentMethodsFiltered = this.paymentMethods;
    } else {
      const confirmation = this._fuseConfirmationService.open({
        title  : 'Eliminar método de pago',
        message: '¿Estás seguro(a) que quieres eliminar este método de pago?. Esta acción no puede deshacerse!',
        actions: {
            confirm: {
                label: 'Eliminar'
            }
        }
      });
  
      confirmation.afterClosed().subscribe( result => {
        if ( result === 'confirmed' ){
          const id = this.selectedPaymentMethodForm.get('_id').value
          this.isLoading = true;
          this.paymentMethodService.deletePaymentMethod(id).subscribe((resp)=>{
              this.flashMessage = resp.success;
              this.seeMessage = true;
              if (resp.success) {
                  this.successMessage = resp.message;
                  this.isLoading = false;
                  setTimeout(()=>{  // 2 segundo se cierra 
                      this.seeMessage = false;
                      }, 2000);
                  setTimeout(()=>{  
                      this.loadListPaymentMethod();
                      this.closeDetails();
                      }, 1000); 
              }
            });
        }
      });
    }

  }

}
