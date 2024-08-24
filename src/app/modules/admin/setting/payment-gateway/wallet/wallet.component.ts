import { Component, OnInit } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseUtilsService } from '@fuse/services/utils';
import { PaymentGatewayService } from '../payment-gateway.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Wallet } from 'app/models/wallet';

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
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
        `,
    ],
 //   animations: fuseAnimations,
})
export class WalletComponent implements OnInit {
    wallets: Wallet[] = [];
    walletsFiltered: Wallet[] = [];
    isLoading: boolean;
    searchInputControl: FormControl = new FormControl();
    selectedWallet: any = null;
    imageLoaded: boolean = false;
    flashMessage: boolean;
    seeMessage: boolean = false;
    successMessage: string;
    files: File[] = [];
    //FORM
    walletForm: FormGroup;
    _id: FormControl;
    entity: FormControl;
    images: FormArray;
    name: FormControl;
    createdAt: FormControl;
    updatedAt: FormControl;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private fuseUtilsService: FuseUtilsService,
        private _paymentGatewayService: PaymentGatewayService,
        private fb: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService
    ) {
        this.createValidators();
        this.createForm();
    }

    ngOnInit(): void {
        this.successMessage = '';
        this.cargarLista();
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((queryInput) => {
                    this.closeDetails();
                    this.isLoading = true;
                    const query = (queryInput as string).toLowerCase();
                    return (this.walletsFiltered = this.wallets.filter(
                        (wallet) => {
                            return (
                                (wallet.name as string)
                                    .toLowerCase()
                                    .match(query) ||
                                (wallet.entity as string)
                                    .toLowerCase()
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
    }

    private createForm(): void {
        this.walletForm = this.fb.group({
            _id: this._id,
            entity: this.entity,
            images: this.images,
            name: this.name,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        });
    }

    private createValidators(): void {
        this._id = new FormControl();
        this.entity = new FormControl('', [Validators.required, Validators.minLength(2)]);
        this.images = new FormArray([]);
        this.name = new FormControl('', [Validators.required, Validators.minLength(2)]);
        this.createdAt = new FormControl();
        this.updatedAt = new FormControl();
    }

    async cargarLista() {
        let resp: any;
        this.isLoading = true;
        this._paymentGatewayService.listarBilletera().subscribe((resp) => {
            if (resp.ok) {
                // Get the wallets
                this.wallets = resp.data;
                this.walletsFiltered = this.wallets;
                this.isLoading = false;
            }
        });
    }

    toggleDetails(walletId: string, open: boolean): void {
        // If the category is already selected...
        if (this.selectedWallet) {
            if (this.selectedWallet._id === walletId) {
                // Close the details
                this.closeDetails();
                return;
            }
        }
        this.successMessage = '';
        this.imageLoaded = false;
        this.seeMessage = false;
        this.files = [];
        if (this.images.length > 0) {
            let i = this.images.length;
            do {
                this.removeImageControl(this.images.length - 1);
                i--;
            } while (i > 0);
        }
        this.walletForm.reset();
        // Get the wallet by id
        const walletFound =
            this.wallets.find((wallet) => wallet._id === walletId) || null;
        this.selectedWallet = walletFound;
        if (walletFound._id !== '-1') {
            this.patchForm(walletFound);
        } else {
            this.walletForm.patchValue({
                _id: '-1',
                createdAt: '',
                updatedAt: '',
            });
        
        }
    }

    async patchForm(wallet): Promise<void> {
        const { images, createdAt, updatedAt} = wallet;
        if (images) {
            this.imageLoaded = true;
            const filesTemp = [];
            for (const image of images) {
                this.addImageControl(image);
                filesTemp.push(
                    await this.onImageEdit(image.imageURL, image.filename)
                );
            }
            this.files = filesTemp;
        }else{
            this.imageLoaded = false;
        }
      //  console.log('createdAt', createdAt, updatedAt)
        this.walletForm.patchValue({
            id: wallet._id,
            ...wallet,
            createdAt: this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(createdAt)),
            updatedAt: this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(updatedAt)),
        });
        this.walletForm.controls.createdAt.disable();
        this.walletForm.controls.updatedAt.disable();
    }

    createImageForm(): FormControl {
        return new FormControl();
    }

    addImageControl(image: any): void {
        const imageProduct = this.createImageForm();
        if (image) {
            imageProduct.patchValue(image);
        }
        this.images.insert(0, imageProduct);
    }
    removeImageControl(index: number): void{
        this.images.removeAt(index);
    }

    public onImageEdit = async (imgUrl, filename): Promise<File> => {
        const response = await fetch(imgUrl);
        const blob = await response.blob();
        const file = new File([blob], filename, {
            type: blob.type,
        });

        return file;
    };

    formatoFecha(fecha: string): string {
        return fecha !== ''
            ? this.fuseUtilsService.formatDate(
                  this.fuseUtilsService.stringToDate(fecha)
              )
            : '';
    }

    closeDetails(): void {
        this.selectedWallet = null;
    }

    agregarNuevaBilleteraElectronica() {
        this.wallets.unshift({
            _id: '-1',
            entity: '',
            images: [],
            name: '',
            createdAt: '',
            updatedAt: '',
        });
        this.walletsFiltered = this.wallets;
    }

    deleteSelectedWallet() {
        if (this.walletForm.get('_id').value === '-1') {
            this.wallets = this.wallets.filter((wallet) => wallet._id !== '-1');
            this.walletsFiltered = this.wallets;
        } else {
            const confirmation = this._fuseConfirmationService.open({
                title: 'Eliminar billetera electrónica',
                message:
                    '¿Estás seguro(a) que quieres eliminar esta billetera electrónica?. Esta acción no puede deshacerse!',
                actions: {
                    confirm: {
                        label: 'Eliminar',
                    },
                },
            });
            // Subscribe to the confirmation dialog closed action
            confirmation.afterClosed().subscribe(async (result) => {
                let resp;
                // If the confirm button pressed...
                if (result === 'confirmed') {
                    // Delete the category on the server
                    const wallet = this.walletForm.value;
                    this.isLoading = true;
                    resp = await this._paymentGatewayService.eliminarBilletera(
                        wallet._id
                    ).toPromise();
                    this.flashMessage = resp.success;
                    this.seeMessage = true;
                    if (resp.success) {
                        this.successMessage = resp.message;
                        this.isLoading = false;
                        setTimeout(() => {
                            // 2 segundo se cierra
                            this.seeMessage = false;
                        }, 2000);
                        setTimeout(() => {
                            this.cargarLista();
                            this.closeDetails();
                        }, 1000);
                    }
                }
            });
        }

  
    }
    async updateselectedWallet() {
        await this.uploadImages();
        const wallet = this.walletForm.value;
        this.isLoading = true;
        this._paymentGatewayService
            .editarBilletera(wallet._id, wallet)
            .subscribe((resp) => {
                this.flashMessage = resp.success;
                this.seeMessage = true;
                if (resp.success) {
                    this.successMessage = resp.message;
                    this.isLoading = false;
                    setTimeout(() => {
                        // 2 segundo se cierra
                        this.seeMessage = false;
                    }, 2000);
                    setTimeout(() => {
                        this.cargarLista();
                        this.closeDetails();
                    }, 1000);
                }
            });
    }

    async crearNuevaBilleteraElectronica() {
        await this.uploadImages();
        if (this.walletForm.valid) {
            const wallet = this.walletForm.value;
            this.isLoading = true;
            delete wallet._id;
            this._paymentGatewayService
                .crearBilletera(wallet)
                .subscribe((resp) => {
                    this.flashMessage = resp.ok;
                    this.seeMessage = true;

                    if (resp.ok) {
                        this.successMessage = resp.message;
                        this.isLoading = false;
                        setTimeout(() => {
                            // 2 segundo se cierra
                            this.seeMessage = false;
                        }, 2000);

                        setTimeout(() => {
                            this.cargarLista();
                            this.closeDetails();
                        }, 1000);
                    }
                });
        }
    }

    uploadImages(): Promise<any> {
        return new Promise( ( resolve, reject ) => {
            const results = this.files.filter(({ name: id1 }) => !this.images.value.some(({ filename: id2 }) => id2 === id1));
            if(results.length === 0) {
                resolve(false);
                return;
            }
            const imagesForm = this.toFormData(results);
            this._paymentGatewayService.subirArchivos(imagesForm)
            .subscribe((res) => {
                if(res.data) {
                    this.addImagesWallet(res.data);
                    resolve(true);
                }
            },(error: HttpErrorResponse)=> {
                reject(error);
            });
        });
    }

    addImagesWallet(images): void {
        for (const image of images) {
            this.addImageControl(image);
        }
    }

    toFormData<T>(formValue: any[]): FormData {
        const formData = new FormData();
        for (const f of formValue) {
           formData.append('images', f);
        }
        return formData;
    }


    getFilesLoades(images): void {
        console.log('getFilesLoades', images);
        if(images.length > 0){
            this.imageLoaded = true;
        }
    }

    getFileRemoved(file: File): void {
        const { name } = file;
        const existProduct = this.images.controls.findIndex(
            (x: any) => x.value.filename === name
        );
        if (existProduct > -1) {
            this.images.removeAt(existProduct);
        }
        if(this.images.length > 0){
            this.imageLoaded = true
        }else{
            this.imageLoaded = false
        }
    }
}
