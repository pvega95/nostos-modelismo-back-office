import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, NgZone, OnInit, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormControl, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { ProductsService } from "../../products/products.service";
import { DecimalPipe } from "@angular/common";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { Product } from "app/models/product";

@Component({
    selector: 'app-sales-modal',
    templateUrl: './sales-modal.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        FormsModule,
        ReactiveFormsModule,
        DecimalPipe
    ],
})
export class SalesModalComponent implements OnInit {
    public orderForm: FormGroup;
    public isLoading: boolean;
    public productSearch: UntypedFormControl = new UntypedFormControl();
    public displayedColumns: string[] = ['select', 'sku', 'name', 'listprice'];
    public dataSource = new MatTableDataSource<any>([]);
    public selection: any[] = [];

    constructor(
        private _productsService: ProductsService,
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<SalesModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        // private _changeDetectorRef: ChangeDetectorRef,
        private _ngZone: NgZone   // Inject NgZone
    ) { }
    ngOnInit(): void {
        this.initForm()
        setTimeout(() => {
            this._productsService.getListProducts(1, 5).subscribe(x => {
                this.dataSource.data = x?.docs;
            })
        });
    }

    initForm(): void {
        this.orderForm = this._formBuilder.group({
            clientSelected: new FormControl(null, Validators.required),
            address: new FormControl('', Validators.required),
            products: new FormArray([]),
        });
    }

    hasValue() {
        if (this.selection.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    isAllSelected() {
        const numSelected = this.selection.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        if (this.isAllSelected()) {
            //  this.selection.clear();
            // console.log('this.dataSource.data', this.dataSource.data)
            this.dataSource.data.forEach(element => {
                if (!element.selected && element.checked) {
                    element.checked = false;
                }
            });
            this.selection = [];
            return;
        }
        this.dataSource.data.forEach(element => {
            if (!element.selected && !element.checked) {
                element.checked = true;
            }
        });
        this.selection.push(...this.dataSource.data);
    }

    toggleItem(product: Product) {
        const index = this.selection.findIndex(obj => obj.sku == product.sku);
        // console.log('product', product, index)
        if (index !== -1) {
            this.selection.splice(index, 1);// quita elemento de lista
        } else {
            this.selection.push(product);//agrega elemento de lista
        }
        const index2 = this.dataSource.data.findIndex(obj => obj.sku == product.sku);
        this.dataSource.data[index2].checked = !this.dataSource.data[index2].checked // desmarca elemento de lista
    }

    addItem(): void {
        this.dialogRef.close(this.selection);
    }

    get productsObs() {
        return this._productsService.products$
    }

    get productsForm() {
        return this.orderForm.get('products') as FormArray;
    }

    get productsControls() {
        return this.productsForm.controls as FormGroup[];
    }

}
