import { Component, OnInit } from '@angular/core';
import { PaymentDeadlineService } from './payment-deadline.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseUtilsService } from '../../../../../@fuse/services/utils/utils.service';
import { fuseAnimations } from '@fuse/animations';
import { PaymentDeadline } from 'app/models/payment-deadline';

@Component({
  selector: 'app-payment-deadline',
  templateUrl: './payment-deadline.component.html',
  styles: [
    /* language=SCSS */
    `
    .inventory-grid {
        grid-template-columns: 48px auto 40px;

        @screen sm {
            grid-template-columns: 48px auto 112px 72px;
        }

        @screen md {
            grid-template-columns: 20rem 20rem 12rem ;
        }

        @screen lg {
            grid-template-columns: 20rem 20rem 12rem ;
        }
          }
      `
      ],
   animations : fuseAnimations,
})
export class PaymentDeadlineComponent implements OnInit {
  public paymentDeadlines: PaymentDeadline[] = [];
  public isLoading: boolean;
  paymentDeadlinesFiltered: any[] = [];
  searchInputControl: FormControl = new FormControl();
  selectedPaymentDeadline: any = null;
  selectedPaymentDeadlineForm: FormGroup;
  flashMessage: boolean;
  seeMessage: boolean = false;
  successMessage: string;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  //expresion regular numeros, espacios y letras con tildes
  maskForInput: any = 
  {mask: /^[A-Za-zÁ-ú0-9\s]+$/g
  };
  maskForDigit: any = 
  { mask: Number,
    signed: false,
    min: 0 ,
    max: 9999999
  };


  constructor(
    private paymentDeadlineService: PaymentDeadlineService,
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    ) { }

  ngOnInit(): void {
    this.successMessage = '';
    this.loadListPaymentDeadline();
    this.searchInputControl.valueChanges
    .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((queryInput) => {
            this.closeDetails();
            this.isLoading = true;
            const query = (queryInput as string).toLowerCase();
          return this.paymentDeadlinesFiltered = this.paymentDeadlines.filter((paymentDeadline)=>{
                return (paymentDeadline.description as string).toLowerCase().match(query)
           });
        }),
        map(() => {
            this.isLoading = false;
        })
    )
    .subscribe(); 
  }

  loadListPaymentDeadline(): void{
    this.isLoading = true;
    this.paymentDeadlineService.getListPaymentDeadline().subscribe((resp)=>{
      if (resp.ok) {
       this.paymentDeadlines = resp.data;
       this.paymentDeadlinesFiltered = this.paymentDeadlines;
       this.isLoading = false;
      }
    });

  }

  toggleDetails(paymentDeadlinetId: string): void
  {
      // If the company is already selected...
      if (this.selectedPaymentDeadline ) {
        if (this.selectedPaymentDeadline._id === paymentDeadlinetId )
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
      const paymentDeadlineEncontrado = this.paymentDeadlines.find(item => item._id === paymentDeadlinetId)  || null;
      //console.log('paymentDeadlineEncontrado', paymentDeadlineEncontrado)
      this.selectedPaymentDeadline = paymentDeadlineEncontrado;
      if(paymentDeadlineEncontrado._id){
          this.selectedPaymentDeadlineForm.patchValue({
            _id: paymentDeadlineEncontrado._id,
            description: paymentDeadlineEncontrado.description,
            days: paymentDeadlineEncontrado.days
          });

      }else{
          this.selectedPaymentDeadlineForm.patchValue({
              _id: '-1',
              description: '',
              days: 0,
            });
      }

  }
  initForm() {
    this.selectedPaymentDeadlineForm = this._formBuilder.group({
        _id               : ['-1'],
        description      : ['', [Validators.required, Validators.minLength(2),  FuseUtilsService.sinEspaciosEnBlanco]],
        days             : ['',[Validators.required, Validators.minLength(1),  FuseUtilsService.sinEspaciosEnBlanco]]
    });
  }

  createPaymentDeadline(): void{
    this.paymentDeadlines.unshift(
      {
        _id: '-1',
        description: '',
        days: 0,
      });
     this.paymentDeadlinesFiltered = this.paymentDeadlines;
  }

  closeDetails(): void
  {
      this.selectedPaymentDeadline = null;
  }
  createNewPaymentDeadline(): void{
    const body: PaymentDeadline = {
      description: this.selectedPaymentDeadlineForm.get('description').value,
      days: this.selectedPaymentDeadlineForm.get('days').value
    } 
    this.isLoading = true;
    if (body) {
      this.paymentDeadlineService.createPaymentDeadline(body).subscribe((resp)=>{       
        this.flashMessage = resp.ok;
        this.seeMessage = true;
        if (resp.ok) {
            this.successMessage = resp.message;
            this.isLoading = false;
            setTimeout(()=>{  // 2 segundo se cierra 
                this.seeMessage = false;
                }, 2000);
            setTimeout(()=>{  
                this.loadListPaymentDeadline();
                this.closeDetails();
                }, 1000); 
        }
      });
    }

  }
  updateSelectedPaymentDeadline(): void{
    const body: PaymentDeadline = {
      description: this.selectedPaymentDeadlineForm.get('description').value,
      days: this.selectedPaymentDeadlineForm.get('days').value
    } 
    const id = this.selectedPaymentDeadlineForm.get('_id').value
    this.isLoading = true;
    if (body) {
      this.paymentDeadlineService.updatePaymentDeadline(id, body).subscribe((resp)=>{
        this.flashMessage = resp.success;
        this.seeMessage = true;
        if (resp.success) {
            this.successMessage = resp.message;
            this.isLoading = false;
            setTimeout(()=>{  // 2 segundo se cierra 
                this.seeMessage = false;
                }, 2000);
            setTimeout(()=>{  
                this.loadListPaymentDeadline();
                this.closeDetails();
                }, 1000); 
        }
      });
    }
  }
  deleteSelectedPaymentDeadline(): void{
    if (this.selectedPaymentDeadlineForm.get('_id').value === '-1') {
        this.paymentDeadlines = this.paymentDeadlines.filter((paymentDeadline) => paymentDeadline._id !== '-1');
        this.paymentDeadlinesFiltered = this.paymentDeadlines;
    } else {
      const confirmation = this._fuseConfirmationService.open({
        title  : 'Eliminar plazo de pago "' +  this.selectedPaymentDeadlineForm.get('description').value+ '"',
        message: '¿Estás seguro(a) que quieres eliminar este plazo de pago?. Esta acción no puede deshacerse!',
        actions: {
            confirm: {
                label: 'Eliminar'
            }
        }
      });
      confirmation.afterClosed().subscribe( result => {
        if ( result === 'confirmed' ){
          const id = this.selectedPaymentDeadlineForm.get('_id').value
          this.isLoading = true;
          this.paymentDeadlineService.deletePaymentDeadline(id).subscribe((resp)=>{
              this.flashMessage = resp.success;
              this.seeMessage = true;
              if (resp.success) {
                  this.successMessage = resp.message;
                  this.isLoading = false;
                  setTimeout(()=>{  // 2 segundo se cierra 
                      this.seeMessage = false;
                      }, 2000);
                  setTimeout(()=>{  
                      this.loadListPaymentDeadline();
                      this.closeDetails();
                      }, 1000); 
              }
            });
          }
        });
    }



  }


}
