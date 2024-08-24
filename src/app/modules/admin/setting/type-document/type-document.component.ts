import { Component, OnInit } from '@angular/core';
import { TypeDocumentService } from './type-document.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseUtilsService } from '../../../../../@fuse/services/utils/utils.service';
import { TypeDocument } from 'app/models/document-type';

@Component({
  selector: 'app-type-document',
  templateUrl: './type-document.component.html',
  styles: [
    /* language=SCSS */
    `
    .inventory-grid {
        grid-template-columns: 48px auto 40px;

        @screen sm {
            grid-template-columns: 48px auto 112px 72px;
        }

        @screen md {
            grid-template-columns: 20rem 18rem 10rem  ;
        }

        @screen lg {
            grid-template-columns: 20rem 18rem 10rem  ;
        }
          }
      `
      ],
   animations : fuseAnimations,
})
export class TypeDocumentComponent implements OnInit {
  public typeDocuments: TypeDocument[] = [];
  public isLoading: boolean;
  typeDocumentsFiltered: any[] = [];
  searchInputControl: FormControl = new FormControl();
  selectedTypeDocument: any = null;
  selectedTypeDocumentForm: FormGroup;
  flashMessage: boolean;
  seeMessage: boolean = false;
  successMessage: string;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
    //expresion regular numeros, espacios y letras
    maskForInput: any = 
    {mask: /^[A-Za-z0-9\s]+$/g
    };
    maskForDigit: any = 
    {mask: Number
    };


  constructor(
    private typeDocumentService: TypeDocumentService,
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    ) { }

  ngOnInit(): void {
    this.successMessage = '';
    this.loadListTypeDocument();
    this.searchInputControl.valueChanges
    .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((queryInput) => {
            this.closeDetails();
            this.isLoading = true;
            const query = (queryInput as string).toLowerCase();
          return this.typeDocumentsFiltered = this.typeDocuments.filter((typeDocument)=>{
                return (typeDocument.name as string).toLowerCase().match(query)  
           });
        }),
        map(() => {
            this.isLoading = false;
        })
    )
    .subscribe(); 
  }

  toggleDetails(documentId: string): void
  {
      // If the company is already selected...
      if (this.selectedTypeDocument ) {
        if (this.selectedTypeDocument._id === documentId )
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
      const typeDocumentEncontrado = this.typeDocuments.find(item => item._id === documentId)  || null;
      //console.log('typeDocumentEncontrado', typeDocumentEncontrado)
      this.selectedTypeDocument = typeDocumentEncontrado;
      if(typeDocumentEncontrado._id){
          this.selectedTypeDocumentForm.patchValue({
            _id: typeDocumentEncontrado._id,
            name: typeDocumentEncontrado.name,
            maxDigits: typeDocumentEncontrado.maxDigits
          });

      }else{
          this.selectedTypeDocumentForm.patchValue({
              _id: -1,
              name: '',
              maxDigits: ''
            });
      }

  }
  initForm() {
    this.selectedTypeDocumentForm = this._formBuilder.group({
        _id        : ['-1'],
        name      : ['', [Validators.required, Validators.minLength(2),  FuseUtilsService.sinEspaciosEnBlanco]],
        maxDigits : ['', [Validators.required, Validators.minLength(1),  FuseUtilsService.sinEspaciosEnBlanco]],
    });
  }
  createTypeDocument(): void{
    this.typeDocuments.unshift(
      {
        _id: '-1',
        name: '',
        maxDigits: 0
      });
    this.typeDocumentsFiltered = this.typeDocuments;
  }


  loadListTypeDocument(): void{
    this.isLoading = true;
    this.typeDocumentService.getTypeListDocument().subscribe((resp)=>{
      if (resp.ok) {
       this.typeDocuments = resp.data;
       this.typeDocumentsFiltered = this.typeDocuments;
       this.isLoading = false;
      }
    });
  }

  closeDetails(): void
  {
      this.selectedTypeDocument = null;
  }
  createNewTypeDocument(): void{
    const body: TypeDocument = {
      name: this.selectedTypeDocumentForm.get('name').value,
      maxDigits: FuseUtilsService.convertFromValueToNumber(this.selectedTypeDocumentForm.get('maxDigits').value)
    } 
    this.isLoading = true;
    if (body) {
      this.typeDocumentService.createTypeDocument(body).subscribe((resp)=>{       
        this.flashMessage = resp.ok;
        this.seeMessage = true;
        if (resp.ok) {
            this.successMessage = resp.message;
            this.isLoading = false;
            setTimeout(()=>{  // 2 segundo se cierra 
                this.seeMessage = false;
                }, 2000);
            setTimeout(()=>{  
                this.loadListTypeDocument();
                this.closeDetails();
                }, 1000); 
        }
      });
    }
  }
  updateSelectedTypeDocument(): void{
    const body: TypeDocument = {
      name: this.selectedTypeDocumentForm.get('name').value,
      maxDigits: FuseUtilsService.convertFromValueToNumber(this.selectedTypeDocumentForm.get('maxDigits').value)
    } 
    const id = this.selectedTypeDocumentForm.get('_id').value
    this.isLoading = true;
    if (body) {
      this.typeDocumentService.updateTypeDocument(id, body).subscribe((resp)=>{
        this.flashMessage = resp.success;
        this.seeMessage = true;
        if (resp.success) {
            this.successMessage = resp.message;
            this.isLoading = false;
            setTimeout(()=>{  // 2 segundo se cierra 
                this.seeMessage = false;
                }, 2000);
            setTimeout(()=>{  
                this.loadListTypeDocument();
                this.closeDetails();
                }, 1000); 
        }
      });
    }
  }
  deleteSelectedTypeDocument(): void{
    if (this.selectedTypeDocumentForm.get('_id').value === '-1') {
      this.typeDocuments = this.typeDocuments.filter((typeDocument) => typeDocument._id !== '-1');
      this.typeDocumentsFiltered = this.typeDocuments;
    } else {
      const confirmation = this._fuseConfirmationService.open({
        title  : 'Eliminar tipo documento "'+ this.selectedTypeDocumentForm.get('name').value+ '"',
        message: '¿Estás seguro(a) que quieres eliminar este tipo documento?. Esta acción no puede deshacerse!',
        actions: {
            confirm: {
                label: 'Eliminar'
            }
        }
      });
      confirmation.afterClosed().subscribe( result => {
        if ( result === 'confirmed' ){
          const id = this.selectedTypeDocumentForm.get('_id').value
          this.isLoading = true;
          this.typeDocumentService.deleteTypeDocument(id).subscribe((resp)=>{
              this.flashMessage = resp.success;
              this.seeMessage = true;
              if (resp.success) {
                  this.successMessage = resp.message;
                  this.isLoading = false;
                  setTimeout(()=>{  // 2 segundo se cierra 
                      this.seeMessage = false;
                      }, 2000);
                  setTimeout(()=>{  
                      this.loadListTypeDocument();
                      this.closeDetails();
                      }, 1000); 
              }
            });
        }
      });
    }

  }
}
