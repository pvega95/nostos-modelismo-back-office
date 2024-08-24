import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import {
    catchError,
    debounceTime,
    delay,
    map,
    startWith,
    switchMap,
    takeUntil,
} from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { isArray } from 'lodash-es';
import { Product } from 'app/models/product';
import { MatTableDataSource } from '@angular/material/table';
import { ProductPresenter } from '../products.presenter';
import { ProductsService } from '../products.service';
import { ProductAddComponent } from '../product-add/product-add.component';
import { ActivatedRoute, Router } from '@angular/router';

const PAGESIZE = 10;
const PAGE = 1;
@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ProductPresenter],
})
export class ProductsListComponent implements OnInit, AfterViewInit, OnDestroy {
    // recentTransactionsTableMatSort: MatSort;
    @ViewChild(MatPaginator) _paginator: MatPaginator;
    @ViewChild(MatSort) _sort: MatSort;

    recentTransactionsDataSource: MatTableDataSource<any> =
        new MatTableDataSource();
    recentTransactionsTableColumns: string[] = [
        'thumb',
        'sku',
        'name',
        'description',
        'category',
        'brand',
        'unid',
        'listprice',
        'discount',
        'actions',
    ];

    products: Product[] = [];
    productsFiltered: Product[] = [];
    isLoading: boolean;
    searchInputNameControl: FormControl = new FormControl();
    searchInputSkuControl: FormControl = new FormControl();

    products$: Observable<any[]>;
    resultsLength: number;
    pagination: any;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private productsService: ProductsService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        public dialog: MatDialog,
        public presenter: ProductPresenter,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        // Get the products
        this.productsService.products$.subscribe((products: any) => {
            console.log('products', products);
            this.products = products;
        });

        this.cargarListaProductos(PAGESIZE, PAGE);

        // Get the pagination
        this.productsService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: any) => {
                console.log(pagination);
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // this.searchInputNameControl.valueChanges
        //     .pipe(
        //         takeUntil(this._unsubscribeAll),
        //         debounceTime(300),
        //         switchMap((queryInput: string) => {
        //             this.isLoading = true;
        //             const query = queryInput.toLowerCase();
        //             return (this.recentTransactionsDataSource.data = this.products.filter(
        //                 (product) =>
        //                     product.name.toLowerCase().match(query) ||
        //                     product.sku.toLowerCase().match(query) ||
        //                     product.listprice.toString().toLowerCase().match(query)
        //             ));
        //         }),
        //         map(() => {
        //             this.isLoading = false;
        //         })
        //     )
        //     .subscribe();
    }

    cargarListaProductos(pageSize: number, page: number): void {
        console.log('cargarListaProductos');
        // this.products = [];
        this.isLoading = true;
        this.productsService
            .getListProducts(page, pageSize)
            .pipe
            // map((resp: any) => resp.docs)
            ()
            .subscribe(({ docs, metadata }) => {
                if (docs) {
                    // Get the products
                    // this.products = docs;
                    // this.resultsLength = metadata[0].total;
                    // this.productsFiltered = this.products;
                    this.isLoading = false;
                    this.recentTransactionsDataSource.data = this.products;
                }
            });
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        if (this._paginator) {
            // Get products if sort or page changes
            merge(this._paginator.page)
                .pipe(
                    switchMap(() => {
                        console.log('changes', this._paginator);
                        this.isLoading = true;
                        return this.productsService.getListProducts(
                            this._paginator.pageIndex + 1,
                            this._paginator.pageSize
                        );
                    }),
                    map(() => {
                        this.isLoading = false;
                    })
                )
                .subscribe();
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    editProduct(idProduct: string): void {
        this.router.navigate(['edit', idProduct], { relativeTo: this.route });
    }

    /**
     * Update the selected product using the form data
     *
     * @param id
     */
    async updateSelectedProduct(id): Promise<void> {
        this.isLoading = true;
        let resp;
        // Get the product object
        const product = this.presenter.form.value;
        if (product.images.length > 0) {
            product.images = product.images.filter(
                (img) => img instanceof File
            );
            resp = await this.productsService.actualizarProducto(
                this.toFormData(product),
                id
            );
        } else {
            resp = await this.productsService.actualizarProducto(product, id);
        }

        if (resp.success) {
            this.isLoading = false;
            setTimeout(() => {
                // 3 segundo se cierra modal
            }, 2000);

            setTimeout(() => {
                this.cargarListaProductos(PAGESIZE, PAGE);
            }, 1000);
        }
    }

    crearNuevoProducto(product): void {
        const productForm = new Product(product);
        this.isLoading = true;
        this.productsService.crearProducto(productForm).subscribe((resp) => {
            this.dialog.closeAll();
            if (resp.ok) {
                this.isLoading = false;
                setTimeout(() => {
                    this.cargarListaProductos(PAGESIZE, PAGE);
                }, 1000);
            }
        });
    }

    actualizarProducto(product, idProduct): void {
        const productForm = new Product(product);
        // const hasTypeFile = productForm.images.some((x) => x instanceof File);
        // const productData = hasTypeFile
        //     ? this.toFormData(productForm)
        //     : productForm;
        this.isLoading = true;
        this.productsService
            .actualizarProducto(productForm, idProduct)
            .subscribe((resp) => {
                this.dialog.closeAll();
                if (resp.ok) {
                    this.isLoading = false;
                    setTimeout(() => {
                        this.cargarListaProductos(PAGESIZE, PAGE);
                    }, 1000);
                }
            });
    }

    toFormData<T>(formValue: T): FormData {
        const formData = new FormData();

        for (const key of Object.keys(formValue)) {
            if (
                key === 'images' ||
                (key === 'descriptions' && isArray(formValue[key]))
            ) {
                for (const f of formValue[key]) {
                    formData.append(key, f);
                }
            } else {
                const value = formValue[key];
                formData.append(key, value);
            }
        }

        return formData;
    }
    /**
     * Delete the selected product using the form data
     */
    deleteProduct(idProduct: string): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Eliminar producto',
            message:
                '¿Estás seguro(a) de eliminar este producto? Esta acción no puede deshacerse!',
            actions: {
                confirm: {
                    label: 'Eliminar',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Get the product object
                this.isLoading = true;
                this.productsService
                    .eliminarProducto(idProduct)
                    .subscribe((resp) => {
                        if (resp.ok) {
                            this.cargarListaProductos(PAGESIZE, PAGE);
                        }
                    });
            }
        });
    }

}
