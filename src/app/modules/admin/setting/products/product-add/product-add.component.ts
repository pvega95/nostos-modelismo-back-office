import {
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrandService } from '../../brand/brand.service';
import { CategoriesService } from '../../category/category.service';
import { UnidService } from '../../unid/unid.service';
import { ProductsService } from '../products.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'app/models/product';
@Component({
    selector: 'app-product-add',
    templateUrl: './product-add.component.html',
    styleUrls: ['./product-add.component.scss'],
})
export class ProductAddComponent implements OnInit {
    categories: any[];
    units: any[];
    brands: any[];
    routeId: string;

    id: FormControl;
    productForm: FormGroup;
    sku: FormControl;
    name: FormControl;
    descriptions: FormArray;
    category: FormControl;
    brand: FormControl;
    unid: FormControl;
    listprice: FormControl;
    discount: FormControl;
    stock: FormControl;
    images: FormArray;
    files: File[] = [];
    isLoading: boolean;
    constructor(
        private cd: ChangeDetectorRef,
        // public dialogRef: MatDialogRef<ProductAddComponent>,
        // @Inject(MAT_DIALOG_DATA) public data: any,
        private productsService: ProductsService,
        private _categoriesService: CategoriesService,
        private _unidService: UnidService,
        private _brandService: BrandService,
        private _productsService: ProductsService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.createValidators();
        this.createForm();
    }

    ngOnInit(): void {
        this.cargarCategorias();
        this.cargarUnidades();
        this.cargarMarcas();
        // const { idProduct } = this.data;
        // if (idProduct) {
        //     this.cargarProducto(idProduct);
        // }
        this.route.params.subscribe(({ id }) => {
            if (id) {
                this.routeId = id;
                this.cargarProducto(this.routeId);
            }
        });
    }

    cargarProducto(id: string): void {
        this._productsService.consultarProducto(id).subscribe((response) => {
            const producto = response.data[0];
            this.patchForm(producto);
        });
    }

    async patchForm(producto): Promise<void> {
        const { images } = producto;
        if (images) {
            const filesTemp = [];
            for (const image of images) {
                this.addImageControl(image);
                filesTemp.push(
                    await this.onImageEdit(image.imageURL, image.filename)
                );
            }
            this.files = filesTemp;
        }
        this.productForm.patchValue(producto);
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

    addImagesProduct(images): void {
        for (const image of images) {
            this.addImageControl(image);
        }
    }

    cargarMarcas(): void {
        this._brandService.listarMarca().subscribe((response) => {
            if (response.ok) {
                this.brands = response.data;
            }
        });
    }

    cargarUnidades(): void {
        this.units = [];
        this._unidService.listarUnidad().subscribe((response) => {
            if (response.ok) {
                this.units = response.data;
            }
        });
    }

    cargarCategorias(): void {
        this.categories = [];
        this._categoriesService.listarCategorias().subscribe((categories) => {
            if (categories.ok) {
                this.categories = categories.data;
            }
        });
    }

    cancel(): void {
        // this.dialogRef.close({});
        this.router.navigate(['setting/products']);
    }

    getFilesLoades(images): void {
        console.log('getFilesLoades', images);
    }

    getFileRemoved(file: File): void {
        const { name } = file;
        const existProduct = this.images.controls.findIndex(
            (x: any) => x.value.filename === name
        );
        if (existProduct > -1) {
            this.images.removeAt(existProduct);
        }
    }

    clearFormArray(formArray: FormArray): void {
        while (formArray.length !== 0) {
            formArray.removeAt(0);
        }
    }

    async submitForm(): Promise<void> {

        await this.uploadImages();
        // Disable the form
        this.productForm.disable();        
        const productForm = this.productForm.value;
        if (this.routeId) {
            this.actualizarProducto(productForm, this.routeId);
        } else {
            this.crearNuevoProducto(productForm);
        }
    }

    crearNuevoProducto(product): void {
        const productForm = new Product(product);
        this.isLoading = true;
        this.productsService
            .crearProducto(productForm)
            .subscribe((resp) => {
                if (resp.ok) {
                    this.isLoading = false;
                    this.router.navigate(['setting/products']);
                }
            });
    }

    actualizarProducto(product, idProduct): void {
        const productForm = new Product(product);
        this.isLoading = true;
        this.productsService
            .actualizarProducto(productForm, idProduct)
            .subscribe((resp) => {
                if (resp.ok) {
                    this.isLoading = false;
                    this.router.navigate(['setting/products']);
                }
            });
    }

    uploadImages(): Promise<any> {
        return new Promise( ( resolve, reject ) => {
            const results = this.files.filter(({ name: id1 }) => !this.images.value.some(({ filename: id2 }) => id2 === id1));
            if(results.length === 0) {
                resolve(false);
                return;
            }
            const imagesForm = this.toFormData(results);
            this._productsService.subirArchivos(imagesForm)
            .subscribe((res) => {
                if(res.data) {
                    this.addImagesProduct(res.data);
                    resolve(true);
                }
            },(error: HttpErrorResponse)=> {
                reject(error);
            });
        });
    }

    toFormData<T>(formValue: any[]): FormData {
        const formData = new FormData();
        for (const f of formValue) {
           formData.append('images', f);
        }
        return formData;
    }

    public onImageEdit = async (imgUrl, filename): Promise<File> => {
        const response = await fetch(imgUrl);
        const blob = await response.blob();
        const file = new File([blob], filename, {
            type: blob.type,
        });

        return file;
    };

    private createForm(): void {
        this.productForm = this.fb.group({
            _id: this.id,
            sku: this.sku,
            name: this.name,
            descriptions: this.descriptions,
            category: this.category,
            brand: this.brand,
            unid: this.unid,
            listprice: this.listprice,
            discount: this.discount,
            stock: this.stock,
            images: this.images,
        });
    }

    private createValidators(): void {
        this.id = new FormControl();
        this.sku = new FormControl();
        this.name = new FormControl();
        this.descriptions = new FormArray([
            new FormControl(),
            new FormControl(),
            new FormControl(),
            new FormControl(),
            new FormControl(),
        ]);
        this.category = new FormControl();
        this.brand = new FormControl();
        this.unid = new FormControl();
        this.listprice = new FormControl();
        this.discount = new FormControl();
        this.stock = new FormControl();
        this.images = new FormArray([]);
    }
}
