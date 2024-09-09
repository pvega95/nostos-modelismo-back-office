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
