import { Component, OnInit } from '@angular/core';
import { DocumentService } from './document.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
// import { FuseUtilsService } from '../../../../../@fuse/services/utils/utils.service';
import { fuseAnimations } from '@fuse/animations';
import { Document } from 'app/models/document';
import { FuseUtilsService } from '@fuse/services/utils';
import { sinEspaciosEnBlanco } from 'app/utils/form';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styles: [
    /* language=SCSS */
    `
    .inventory-grid {
        grid-template-columns: 48px auto 40px;

        @screen sm {
            grid-template-columns: 48px auto 112px 72px;
        }

        @screen md {
            grid-template-columns: 20rem 12rem 10rem 12rem ;
        }

        @screen lg {
            grid-template-columns: 20rem 12rem 10rem 12rem ;
        }
          }
      `
      ],
   animations : fuseAnimations,
})
export class DocumentComponent implements OnInit {
  public documents: Document[] = [];
  public isLoading: boolean;
  documentsFiltered: any[] = [];
  searchInputControl: FormControl = new FormControl();
  selectedDocument: any = null;
  selectedDocumentForm: FormGroup;
  flashMessage: boolean;
  seeMessage: boolean = false;
  successMessage: string;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  //expresion regular numeros, espacios y letras
  maskForInput: any =
  {mask: /^[A-Za-z0-9\s]+$/g
  };

  constructor(
    private documentService: DocumentService,
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    ) { }

  ngOnInit(): void {
    this.successMessage = '';
    this.loadListDocument();
    this.searchInputControl.valueChanges
    .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((queryInput) => {
            this.closeDetails();
            this.isLoading = true;
            const query = (queryInput as string).toLowerCase();
          return this.documentsFiltered = this.documents.filter((company)=>{
                return (company.description as string).toLowerCase().match(query) || (company.abreviation as string).toLowerCase().match(query)
           });
        }),
        map(() => {
            this.isLoading = false;
        })
    )
    .subscribe();
  }
  loadListDocument():void{
    this.isLoading = true;
    this.documentService.getListDocument().subscribe((resp)=>{
      if (resp.ok) {
       this.documents = resp.data;
       this.documentsFiltered = this.documents;
       this.isLoading = false;

      }
    });
  }
  closeDetails(): void
  {
      this.selectedDocument = null;
  }

  toggleDetails(documentId: string): void
  {
      // If the company is already selected...
      if (this.selectedDocument ) {
        if (this.selectedDocument._id === documentId )
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
      const documentEncontrado = this.documents.find(item => item._id === documentId)  || null;
      //console.log('documentEncontrado', documentEncontrado)
      this.selectedDocument = documentEncontrado;
      if(documentEncontrado._id){
          this.selectedDocumentForm.patchValue({
            _id: documentEncontrado._id,
            description: documentEncontrado.description,
            abreviation: documentEncontrado.abreviation,
            typeDocument: documentEncontrado.typeDocument
          });

      }else{
          this.selectedDocumentForm.patchValue({
              _id: '-1',
              description: '',
              abreviation: '',
              typeDocument: ''
            });
      }

  }
  initForm() {
    this.selectedDocumentForm = this._formBuilder.group({
        _id               : ['-1'],
        description      : ['', [Validators.required, Validators.minLength(2),  sinEspaciosEnBlanco]],
        abreviation      : ['',[Validators.required, Validators.minLength(2),  sinEspaciosEnBlanco]],
        typeDocument     : ['',[Validators.required, Validators.minLength(2),  sinEspaciosEnBlanco]],
    });
  }

  createDocument(): void{
    this.documents.unshift(
      {
        _id: '-1',
        description: '',
        abreviation: '',
        typeDocument: ''
      });
    this.documentsFiltered = this.documents;
  }
  createNewdocument(): void{
    const body: Document = {
      description: this.selectedDocumentForm.get('description').value,
      abreviation: this.selectedDocumentForm.get('abreviation').value,
      typeDocument: this.selectedDocumentForm.get('typeDocument').value,
    }
    this.isLoading = true;
    if (body) {
      this.documentService.createDocument(body).subscribe((resp)=>{
        this.flashMessage = resp.ok;
        this.seeMessage = true;
        if (resp.ok) {
            this.successMessage = resp.message;
            this.isLoading = false;
            setTimeout(()=>{  // 2 segundo se cierra
                this.seeMessage = false;
                }, 2000);
            setTimeout(()=>{
                this.loadListDocument();
                this.closeDetails();
                }, 1000);
        }
      });
    }
  }
  updateSelectedDocument(): void{
    const body: Document = {
      description: this.selectedDocumentForm.get('description').value,
      abreviation: this.selectedDocumentForm.get('abreviation').value,
      typeDocument: this.selectedDocumentForm.get('typeDocument').value,
    }
    const id = this.selectedDocumentForm.get('_id').value
    this.isLoading = true;
    if (body) {
      this.documentService.updateDocument(id, body).subscribe((resp)=>{
        this.flashMessage = resp.success;
        this.seeMessage = true;
        if (resp.success) {
            this.successMessage = resp.message;
            this.isLoading = false;
            setTimeout(()=>{  // 2 segundo se cierra
                this.seeMessage = false;
                }, 2000);
            setTimeout(()=>{
                this.loadListDocument();
                this.closeDetails();
                }, 1000);
        }
      });
    }
  }
  deleteSelectedDocument() {
    if (this.selectedDocumentForm.get('_id').value === '-1') {
     this.documents = this.documents.filter((document) => document._id !== '-1');
     this.documentsFiltered = this.documents;
    } else {
      const confirmation = this._fuseConfirmationService.open({
        title  : 'Eliminar documento',
        message: '¿Estás seguro(a) que quieres eliminar este documento?. Esta acción no puede deshacerse!',
        actions: {
            confirm: {
                label: 'Eliminar'
            }
        }
      });
    confirmation.afterClosed().subscribe( result => {
      if ( result === 'confirmed' ){
        const id = this.selectedDocumentForm.get('_id').value
        this.isLoading = true;
        this.documentService.deleteDocument(id).subscribe((resp)=>{
            this.flashMessage = resp.success;
            this.seeMessage = true;
            if (resp.success) {
                this.successMessage = resp.message;
                this.isLoading = false;
                setTimeout(()=>{  // 2 segundo se cierra
                    this.seeMessage = false;
                    }, 2000);
                setTimeout(()=>{
                    this.loadListDocument();
                    this.closeDetails();
                    }, 1000);
            }
          });
        }
      });
    }


  }
}
