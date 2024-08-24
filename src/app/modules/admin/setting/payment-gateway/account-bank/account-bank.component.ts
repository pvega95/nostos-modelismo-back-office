import { Component, OnInit } from '@angular/core';
import {
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
import { CategoriesService } from '../../category/category.service';
import { PaymentGatewayService } from '../payment-gateway.service';
import { CURRENCY, TYPE_ACCOUNT } from 'app/enums/account-bank.const';
import { AccountBank } from 'app/models/account-bank';

@Component({
    selector: 'app-account-bank',
    templateUrl: './account-bank.component.html',
    styles: [
        `
            .inventory-grid {
                grid-template-columns: repeat(6, 1fr);

                @screen sm {
                    grid-template-columns: repeat(6, 1fr);
                }

                @screen md {
                    grid-template-columns: repeat(6, 1fr);
                }

                @screen lg {
                    grid-template-columns: repeat(6, 1fr);
                }
            }
        `,
    ],
    animations: fuseAnimations,
})
export class AccountBankComponent implements OnInit {
    accountBanks: AccountBank[] = [];
    accountBanksFiltered: AccountBank[] = [];
    isLoading: boolean;
    searchInputControl: FormControl = new FormControl();
    selectedAccountBank: any = null;
    flashMessage: boolean;
    seeMessage: boolean = false;
    successMessage: string;
    files: File[] = [];
    currencyList: string[] = CURRENCY;
    typeAccountList: string[] = TYPE_ACCOUNT;
    //FORM
    accountBankForm: FormGroup;
    _id: FormControl;
    entity: FormControl;
    typeAccount: FormControl;
    currency: FormControl;
    owner: FormControl;
    numberAccount: FormControl;
    cciAccount: FormControl;
    createdAt: FormControl;
    updatedAt: FormControl;

    //expresion regular numeros, espacios y letras
    maskForInput: any = 
    {mask: /^[A-Za-z0-9\s]+$/g
    };
    //expresion regular numeros, guion y letras
    maskForInputCCI: any = 
    {mask: /^[A-Za-z0-9_-]+$/g
    };
    

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
                    return (this.accountBanksFiltered =
                        this.accountBanks.filter((accountBank) => {
                            return (
                                accountBank.entity
                                    .toLowerCase()
                                    .match(query) ||
                                accountBank.currency
                                    .toLowerCase()
                                    .match(query) ||
                                accountBank.numberAccount
                                    .toLowerCase()
                                    .match(query)    
                            );
                        }));
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();
    }

    private createForm(): void {
        this.accountBankForm = this.fb.group({
            _id: this._id,
            entity: this.entity,
            typeAccount: this.typeAccount,
            currency: this.currency,
            owner: this.owner,
            numberAccount: this.numberAccount,
            cciAccount: this.cciAccount,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        });
    }

    private createValidators(): void {
        this._id = new FormControl();
        this.entity = new FormControl('', [Validators.required, Validators.minLength(3)]);
        this.typeAccount = new FormControl('', [Validators.required]);
        this.currency = new FormControl('', [Validators.required]);
        this.owner = new FormControl('', [Validators.required, Validators.minLength(3)]);
        this.numberAccount = new FormControl('', [Validators.required, Validators.minLength(8)]);
        this.cciAccount = new FormControl('', [Validators.required, Validators.minLength(8)]);
        this.createdAt = new FormControl();
        this.updatedAt = new FormControl();
    }

    async cargarLista() {
        let resp: any;
        this.isLoading = true;
        this._paymentGatewayService.listarCuentaBancaria().subscribe((resp) => {
            if (resp.ok) {
                // Get the products
                this.accountBanks = resp.data;
                this.accountBanksFiltered = this.accountBanks;
                this.isLoading = false;
            }
        });
    }

    toggleDetails(accountBankId: string, open: boolean): void {
        // If the accountBank is already selected...
        if (this.selectedAccountBank) {
            if (this.selectedAccountBank._id === accountBankId) {
                // Close the details
                this.closeDetails();
                return;
            }
        }
        this.successMessage = '';
        this.seeMessage = false;
        this.accountBankForm.reset();
        // Get the accountBank by id
        const accountBankFound =
            this.accountBanks.find((item) => item._id === accountBankId) || null;
        console.log(accountBankFound);
        this.selectedAccountBank = accountBankFound;
        if (accountBankFound._id !== '-1') {
            this.patchForm(accountBankFound);
        } else {
            this.accountBankForm.patchValue({
                _id: '-1',
                entity: '',
                owner: '',
                numberAccount: '',
                cciAccount: ''
            });
        }
    }

    patchForm(accountBank): void {
        const {createdAt, updatedAt} = accountBank;
        this.accountBankForm.patchValue({
            id: accountBank._id,
            ...accountBank,
            createdAt: this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(createdAt)),
            updatedAt: this.fuseUtilsService.formatDate(this.fuseUtilsService.stringToDate(updatedAt)),
        });
        this.accountBankForm.controls.createdAt.disable();
        this.accountBankForm.controls.updatedAt.disable();
    }

    formatoFecha(fecha: string): string {
        return fecha !== ''
            ? this.fuseUtilsService.formatDate(
                  this.fuseUtilsService.stringToDate(fecha)
              )
            : '';
    }

    closeDetails(): void {
        this.selectedAccountBank = null;
    }

    addNewAccountBank() {
        this.accountBanks.unshift({
            _id: '-1',
            entity: '',
            typeAccount: '',
            currency: '',
            owner: '',
            numberAccount: '',
            cciAccount: '',
            createdAt: '',
            updatedAt: '',
        });
        this.accountBanksFiltered = this.accountBanks;
    }

    deleteSelectedAccountBank() {
    if (this.accountBankForm.get('_id').value === '-1') {
        this.accountBanks = this.accountBanks.filter((accountBank) => accountBank._id !== '-1');
        this.accountBanksFiltered = this.accountBanks;
    } else {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Eliminar cuenta bancaria',
            message:
                '¿Estás seguro(a) que quieres eliminar esta cuenta bancaria?. Esta acción no puede deshacerse!',
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
                // Delete the accountBank on the server
                const accountBank = this.accountBankForm.getRawValue();
                this.isLoading = true;
                resp = await this._paymentGatewayService.eliminarCuentaBancaria(
                    accountBank._id
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
    async updateSelectedAccountBank() {
        const accountBanks = this.accountBankForm.getRawValue();
        this.isLoading = true;
        this._paymentGatewayService
            .editarCuentaBancaria(accountBanks._id, accountBanks)
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

    async createNewAccountBank(): Promise<void> {
        if (this.accountBankForm.valid) {
            const accountBanks = this.accountBankForm.value;
            this.isLoading = true;
            delete accountBanks._id;
            this._paymentGatewayService
                .crearCuentaBancaria(accountBanks)
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
}
