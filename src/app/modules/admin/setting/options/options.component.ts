import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { OptionsService } from './options.service';
import { WindowModalComponent } from '../../../../shared/window-modal/window-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Modal } from '../../../../enums/modal.enum';
import { FuseUtilsService } from '../../../../../@fuse/services/utils/utils.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styles: [
          `
          .inventory-grid {
              grid-template-columns: 48px auto 40px;

              @screen sm {
                  grid-template-columns: 48px auto 112px 72px;
              }

              @screen md {
                  grid-template-columns: 14rem 10rem 10rem 13rem 8rem;
              }

              @screen lg {
                  grid-template-columns: 14rem 10rem 10rem 13rem 8rem;
              }
          }
      `
  ],
  animations     : fuseAnimations
})
export class OptionsComponent implements OnInit {
  options: any[] = [];
  isLoading: boolean = true;
  searchInputControl: FormControl = new FormControl();
  selectedOption: any = null;
  selectedOptionForm: FormGroup;

  constructor(
    private fuseUtilsService: FuseUtilsService,
    private optionsService: OptionsService,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.cargarListaOpciones();

  this.dialog.open(WindowModalComponent, {
      data: {
              type: Modal.success
          },
      disableClose: true,
      //panelClass: 'transparent'  // va junto con loading
    });   

/*    setTimeout(()=>{  // 3 segundo se cierra modal
      this.dialog.closeAll();
  }, 3000);  */


  }
  async cargarListaOpciones(){
    let resp: any;
    resp = await this.optionsService.listarOpciones();
    if(resp.ok){
      // Get the opciones
      this.options = resp.data;
      this.isLoading = false;
      console.log('lista opciones',resp.data);
    }

  }

  agregarNuevaOpcion(){
    
  }
}
