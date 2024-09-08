import { CompanyService } from './company.service';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { Select } from "app/models/select";
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseUtilsService } from '../../../../../@fuse/services/utils/utils.service';
// import { Company } from '../../../../models/company';
import { CommonService } from '../../../../shared/services/common.service'
import { Company } from 'app/models/company';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styles: [
    /* language=SCSS */
    `
    .inventory-grid {
        grid-template-columns: 48px auto 40px;

        @screen sm {
            grid-template-columns: 48px auto 112px 72px;
        }

        @screen md {
            grid-template-columns: 20rem 7rem 10rem 12rem 6rem;
        }

        @screen lg {
            grid-template-columns: 20rem 7rem 10rem 12rem 6rem;
        }
    }
`
],
animations     : fuseAnimations,
//providers: [ClientPresenter],
})
export class CompanyComponent implements OnInit {
  public companies: Company[] = [];
  public isLoading: boolean;
  public departments: any[];
  public provinces: any[];
  public districts: any[];
  public listObjDepartment: Select[];
  public listObjProvince: Select[];
  public listObjDistrict: Select[];
  companiesFiltered: any[] = [];
  searchInputControl: FormControl = new FormControl();
  selectedCompany: any = null;
  selectedCompanyForm: FormGroup;
  flashMessage: boolean;
  seeMessage: boolean = false;
  successMessage: string;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  maskForRUC: any =
  {mask: '00000000000'
  };

  constructor(
    private fuseUtilsService: FuseUtilsService,
    private companyService: CompanyService,
    private commonService: CommonService,
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    ) { }

  ngOnInit(): void {
    this.successMessage = '';
    this.loadUbigeo();
    this.loadListCompany();
    this.searchInputControl.valueChanges
    .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((queryInput) => {
            this.closeDetails();
            this.isLoading = true;
            const query = (queryInput as string).toLowerCase();
          return this.companiesFiltered = this.companies.filter((company)=>{
                return (company.comercialName as string).toLowerCase().match(query) || (company.ruc as string).toLowerCase().match(query)
           });
        }),
        map(() => {
            this.isLoading = false;
        })
    )
    .subscribe();
  }
  async loadUbigeo(): Promise<void>{
    let resp1;
    this.departments = [];

    this.listObjDepartment = [];
    this.listObjProvince = [];
    this.listObjDistrict = [];
    //this.addressClient = [];

    resp1 = await this.commonService.listarDepartamentos();
  if (resp1.ok) {
      this.departments = resp1.data;
      this.listObjDepartment = this.formatOptions(this.departments);
  }



  }
  initForm() {
    this.selectedCompanyForm = this._formBuilder.group({
        _id              : ['-1'],
        comercialName    : ['', [Validators.required, Validators.minLength(2), FuseUtilsService.sinEspaciosEnBlanco]],
        ruc              : ['', [Validators.required, Validators.minLength(11),  Validators.maxLength(11), FuseUtilsService.sinEspaciosEnBlanco]],
        department       : ['',[Validators.required]],
        province         : ['',[Validators.required]],
        district         : ['',[Validators.required]],
        createdDate      : [''],
        updatedDate      : [''],
        listObjProvince: new FormControl([]),
        listObjDistrict: new FormControl([]),
    });
    this.selectedCompanyForm.controls.createdDate.disable();
    this.selectedCompanyForm.controls.updatedDate.disable();
  }

  loadListCompany() {
    this.isLoading = true;
    this.companyService.getListCompany().subscribe((resp)=>{
      if (resp.ok) {
       this.companies = resp.data;
       this.companiesFiltered = this.companies;
       this.isLoading = false;

      }
    });

  }
  objDepartmentSelected(event){
    let resp: any;
    this.listObjProvince = [];
    this.selectedCompanyForm.patchValue({
     listObjProvince: [],
     listObjDistrict: []
     });
     this.commonService.listarProvincias(event.id).then((resp)=>{
         if (resp.ok) {
             const provinces = resp.data;
             const listObjProvince = this.formatOptions(provinces);
             this.listObjProvince = listObjProvince;
             this.selectedCompanyForm.patchValue({
                 listObjProvince: listObjProvince,
                 department: event.id
             });
          /*    if (this.form.get('uid')?.value === null) {

             } */

         }
     });
 }
 async objProvinceSelected(event){
  let resp: any;
  this.selectedCompanyForm.patchValue({
      listObjDistrict: []
      });
  resp = await this.commonService.listarDistritos(event.id);
  if (resp.ok) {
      const districts = resp.data;
      const listObjDistrict = this.formatOptions(districts);
      this.selectedCompanyForm.patchValue({
          listObjDistrict: listObjDistrict
      });

      this.selectedCompanyForm.patchValue({
          province: event.id
      });
  }
}
objDistrictSelected(event){
  this.selectedCompanyForm.patchValue({
      district: event.id
  });
}


  toggleDetails(companyId: string): void
  {
      // If the company is already selected...
      if (this.selectedCompany ) {
        if (this.selectedCompany._id === companyId )
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
      const companyEncontrado = this.companies.find(item => item._id === companyId)  || null;
      //console.log('companyEncontrado', companyEncontrado)
      this.selectedCompany = companyEncontrado;
      if(companyEncontrado._id){
          this.selectedCompanyForm.patchValue({
            _id: companyEncontrado._id,
            comercialName: companyEncontrado.comercialName,
            ruc: companyEncontrado.ruc,
            department: companyEncontrado.department,
            province: companyEncontrado.province,
            district: companyEncontrado.district,
            createdDate: companyEncontrado.createdAt !== '' ?  this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(companyEncontrado.createdAt)) : '',
            updatedDate: companyEncontrado.updatedAt !== '' ? this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(companyEncontrado.updatedAt)) : ''

          });

      }else{
          this.selectedCompanyForm.patchValue({
              _id: -1,
              comercialName: '',
              ruc: '',
              createdDate: '',
              updatedDate: ''
            });

      }

  }
  formatoFecha(fecha: string): string{
    return  fecha !== '' ? this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(fecha)) : ''
  }

  closeDetails(): void
  {
      this.selectedCompany = null;
  }

  createCompany(): void{
    this.companies.unshift(
      {
        _id: '-1',
        ruc:'',
        comercialName: '',
        department: '',
        province: '',
        district: '',
        createdAt: '',
        updatedAt: ''
      });
    this.companiesFiltered = this.companies;
  }
  createNewCompany(): void{
    const body: Company = {
      ruc: this.selectedCompanyForm.get('ruc').value,
      comercialName: this.selectedCompanyForm.get('comercialName').value,
      department: this.selectedCompanyForm.get('department').value,
      province: this.selectedCompanyForm.get('province').value,
      district: this.selectedCompanyForm.get('district').value,
    }
    this.isLoading = true;
    if (body) {
      this.companyService.createCompany(body).subscribe((resp)=>{
        this.flashMessage = resp.ok;
        this.seeMessage = true;

        if (resp.ok) {
            this.successMessage = resp.message;
            this.isLoading = false;
            setTimeout(()=>{  // 2 segundo se cierra
                this.seeMessage = false;
                }, 2000);
            setTimeout(()=>{
                this.loadListCompany();
                this.closeDetails();
                }, 1000);

        }
      });
    }
  }
  updateSelectedCompany(): void{
    const body: Company = {
      ruc: this.selectedCompanyForm.get('ruc').value,
      comercialName: this.selectedCompanyForm.get('comercialName').value,
      department: this.selectedCompanyForm.get('department').value,
      province: this.selectedCompanyForm.get('province').value,
      district: this.selectedCompanyForm.get('district').value,
    }
    const id = this.selectedCompanyForm.get('_id').value
    this.isLoading = true;
    if (body) {
      this.companyService.updateCompany(id, body).subscribe((resp)=>{
        this.flashMessage = resp.success;
        this.seeMessage = true;
        if (resp.success) {
            this.successMessage = resp.message;
            this.isLoading = false;
            setTimeout(()=>{  // 2 segundo se cierra
                this.seeMessage = false;
                }, 2000);
            setTimeout(()=>{
                this.loadListCompany();
                this.closeDetails();
                }, 1000);
        }
      });
    }
  }

  deleteSelectedCompany(): void{
    if (this.selectedCompanyForm.get('_id').value === '-1') {
     // console.log('eliminar company')
      this.companies = this.companies.filter((company) => company._id !== '-1');
      this.companiesFiltered = this.companies;
    } else {
      const confirmation = this._fuseConfirmationService.open({
        title  : 'Eliminar compañía "'+ this.selectedCompanyForm.get('comercialName').value+ '"',
        message: '¿Estás seguro(a) que quieres eliminar esta compañía?. Esta acción no puede deshacerse!',
        actions: {
            confirm: {
                label: 'Eliminar'
            }
        }
      });
    confirmation.afterClosed().subscribe( result => {
      if ( result === 'confirmed' ){
        const id = this.selectedCompanyForm.get('_id').value
        this.isLoading = true;
        this.companyService.deleteCompany(id).subscribe((resp)=>{
            this.flashMessage = resp.success;
            this.seeMessage = true;
            if (resp.success) {
                this.successMessage = resp.message;
                this.isLoading = false;
                setTimeout(()=>{  // 2 segundo se cierra
                    this.seeMessage = false;
                    }, 2000);
                setTimeout(()=>{
                    this.loadListCompany();
                    this.closeDetails();
                    }, 1000);
            }
          });
        }
      });
    }

  }



  formatOptions(listObjRaw: any[]): Select[]{
      let listObj: Select[] = [];
      listObjRaw.forEach(objRaw => {
          listObj.push({
              id: objRaw.id as string,
              label: objRaw.name
          })
      });
    return listObj;
  }


}
