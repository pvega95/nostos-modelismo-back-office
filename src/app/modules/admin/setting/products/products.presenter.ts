import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { FuseUtilsService } from '@fuse/services/utils/utils.service';

@Injectable()
export class ProductPresenter {
    form: FormGroup;
    images: FormArray;
    sku: FormControl;
    name: FormControl;
    price: FormControl;
    weight: FormControl;
    descriptions: FormArray;
    thumbnail: FormControl;
    category: FormControl;
    options: FormControl;
    stock: FormControl;
    createdAt: FormControl;
    updatedAt: FormControl;
    id: FormControl;
    currentImageIndex: FormControl;
    maskForPrice: any =
    { mask: Number,
      radix: '.',
      signed: false,
      mapToRadix: [','],
      scale: 2,
      min: 1,
      max: 999999999 };
      maskForWeight: any =
      { mask: Number,
        radix: '.',
        signed: false,
        mapToRadix: [','],
        scale: 2,
        min: 1,
        max: 999999999 };

    constructor(protected fb: FormBuilder, private fuseUtilsService: FuseUtilsService,) {
        this.createValidators();
        this.createForm();
    }

    get descriptionsForm() {
        return this.form.get('descriptions') as FormArray;
    }

    get descriptionsControls() {
        return this.descriptionsForm.controls as FormGroup[];
    }

    get currentImageIdx(){
        return this.form.get('currentImageIndex').value
    }

    get idForm(){
        return this.form.get('id');
    }

    createForm(): void {
        this.form = this.fb.group({
            id: this.id,
            images: this.images,
            sku: this.sku,
            name: this.name,
            price: this.price,
            weight: this.weight,
            descriptions: this.descriptions,
            thumbnail: this.thumbnail,
            category: this.category,
            options: this.options,
            stock: this.stock,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            currentImageIndex: this.currentImageIndex
        });
        this.form.controls.createdAt.disable();
        this.form.controls.updatedAt.disable();
    }

    private createValidators(): void {
        this.id = new FormControl(-1);
        this.images = new FormArray([]);
        this.sku = new FormControl('', [Validators.required,]);
        this.name = new FormControl('', [Validators.required,]);
        this.price = new FormControl('', [Validators.required,]);
        this.weight = new FormControl();
        this.descriptions = new FormArray([]);
        this.thumbnail = new FormControl();
        this.category = new FormControl();
        this.options = new FormControl();
        this.stock = new FormControl(99);
        this.createdAt = new FormControl();
        this.updatedAt = new FormControl();
        this.currentImageIndex = new FormControl(0);
    }

    createDescriptionForm(val?: string): FormControl {
        return new FormControl(val || '');
    }

    createImageForm(): FormControl {
        return new FormControl();
    }

    addDescriptionControl(val?: string) {
        const formDescription = this.createDescriptionForm(val);
        this.descriptionsForm.push(formDescription);
    }
    removeDescriptionControl() {
        this.descriptionsForm.removeAt(this.descriptionsForm.length -1);
    }

    addImageControl(image?: File) {
        const imageProduct = this.createImageForm();
        if (image) {
            imageProduct.patchValue(image);
        }
        this.images.insert(0, imageProduct);
        // const existProduct = this.images.controls.findIndex((x) => x.value === image);
        // if (existProduct > -1) {
        // //   const quantity = this.images.at(existProduct).get('quantity');
        // //   quantity.setValue(quantity.value + 1);
        // } else {
        //   const imageProduct = this.creatImageForm();
        //   imageProduct.patchValue(image);
        //   this.images.insert(0, imageProduct);
        // }   
    }
    loadListImages(listObjImages: any[]): string[] {
        let listImages: string[] = [];
        if (listObjImages.length > 0) {
            listObjImages.forEach(obj => {
                listImages.push(obj.imageURL);
            });
        }
        return listImages;
    }

    addImages(files: File[]){
        for (const file of files) {
            this.addImageControl(file);
          }
    }

    loadProductForm(product){
        console.log('loadProductForm', product);
        const { descriptions, images } = product;
        this.form.patchValue({
            descriptions: product.descriptions,
            sku: product.sku,
            name: product.name,
            price: product.price,
            weight: product.weight,
            thumbnail: product.thumbnail,
            category: product.category,
            stock: product.stock,
            images: product.images,
            currentImageIndex: product.currentImageIndex,
            createdAt: this.formatoFecha(product.createdAt),
            updatedAt: this.formatoFecha(product.updatedAt)
        });
        this.idForm.setValue(product._id);
        if(descriptions.length > 0) {
            descriptions.map(desc => this.addDescriptionControl(desc))
        }
        if(images.length > 0) {
            images.map(img => this.addImageControl(img))
        }
    }

    formatoFecha(fecha: string): string{
        return this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(fecha))
      }

    resetProductForm(){
        this.form.reset();
        this.stock.setValue(99);
        this.currentImageIndex.setValue(0);
        this.clearFormArray(this.images);
        this.clearFormArray(this.descriptions);
    }

    limpiarImagenes(){
        while (this.images.length !== 0) {
            this.images.removeAt(0)
          }
    }

    clearFormArray(formArray: FormArray) {
        while (formArray.length !== 0) {
          formArray.removeAt(0)
        }
      }
}