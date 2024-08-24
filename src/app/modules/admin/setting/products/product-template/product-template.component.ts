import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from 'app/shared/services/file.service';
import { saveAs } from 'file-saver';
import { ProductsService } from '../products.service';
@Component({
    selector: 'app-product-template',
    templateUrl: './product-template.component.html',
    styleUrls: ['./product-template.component.scss'],
})
export class ProductTemplateComponent implements OnInit {
    files: File[] = [];
    url: any;
    constructor(
        private router: Router,
        private _fileService: FileService,
        private _productService: ProductsService
    ) {}

    ngOnInit(): void {}

    getFilesLoades(images): void {
        console.log('getFilesLoades', images);
        this.files = images;
    }

    getFileRemoved(file: File): void {
        console.log('file', file);
    }

    download(): void {
        const file = 'productos_meteoro COESTI_1011_ok.xls';
        this._fileService.getFile(file).subscribe(
            ({ url }) => {
                saveAs(url);
                // this.downloadFile(val);
            },
            (err: HttpErrorResponse) => {
                console.log(err);
            }
        );
    }

    downloadFile(data: any): void {
        var url = window.URL.createObjectURL(new Blob([data]));

        // Debe haber una manera mejor de hacer esto...
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = 'Articulos.xls';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
    }

    uploadProducts(): void {
        const formData = this.toFormData(this.files);
        this._productService.subirExcelProductos(formData).subscribe(
            (response)=> {
                console.log(response);
            },
            (error: HttpErrorResponse)=> {
                console.log(error);
            }
        );
    }

    toFormData<T>(formValue: any[]): FormData {
        const formData = new FormData();
        for (const f of formValue) {
           formData.append('file', f);
        }
        return formData;
    }
}
