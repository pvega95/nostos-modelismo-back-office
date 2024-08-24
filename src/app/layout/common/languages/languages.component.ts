import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { take } from 'rxjs/operators';
import { AvailableLangs, TranslocoService } from '@ngneat/transloco';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';

@Component({
    selector       : 'languages',
    templateUrl    : './languages.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'languages'
})
export class LanguagesComponent implements OnInit, OnDestroy
{
    availableLangs: AvailableLangs;
    activeLang: string;
    flagCodes: any;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService,
        private _translocoService: TranslocoService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the available languages from transloco
        this.availableLangs = this._translocoService.getAvailableLangs();

        // Subscribe to language changes
        this._translocoService.langChanges$.subscribe((activeLang) => {

            // Get the active lang
            this.activeLang = activeLang;

            // Update the navigation
            this._updateNavigation(activeLang);
        });

        // Set the country iso codes for languages for flags
        this.flagCodes = {
            'es':'pe',
            'en': 'us'
        };
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set the active lang
     *
     * @param lang
     */
    setActiveLang(lang: string): void
    {
        // Set the active lang
        this._translocoService.setActiveLang(lang);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the navigation
     *
     * @param lang
     * @private
     */
    private _updateNavigation(lang: string): void
    {
        // For the demonstration purposes, we will only update the Dashboard names
        // from the navigation but you can do a full swap and change the entire
        // navigation data.
        //
        // You can import the data from a file or request it from your backend,
        // it's up to you.

        // Get the component -> navigation data -> item
        const navComponent = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>('mainNavigation');

        // Return if the navigation component does not exist
        if ( !navComponent )
        {
            return null;
        }

        // Get the flat navigation data
        const navigation = navComponent.navigation;

        // Get the Project dashboard item and update its title
        const projectDashboardItem = this._fuseNavigationService.getItem('dashboards.project', navigation);
        if ( projectDashboardItem )
        {
            this._translocoService.selectTranslate('Project').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    projectDashboardItem.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }

        // Get the Analytics dashboard item and update its title
        const analyticsDashboardItem = this._fuseNavigationService.getItem('dashboards.analytics', navigation);
        if ( analyticsDashboardItem )
        {
            this._translocoService.selectTranslate('Analytics').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    analyticsDashboardItem.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }

        const idOrderItem = this._fuseNavigationService.getItem('order.id', navigation);
        if ( idOrderItem )
        {
            this._translocoService.selectTranslate('order').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    idOrderItem.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }

        const idSaleNote = this._fuseNavigationService.getItem('salenote.id', navigation);
        if ( idSaleNote )
        {
            this._translocoService.selectTranslate('salenote').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    idSaleNote.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }

        const idInvoice = this._fuseNavigationService.getItem('invoice.id', navigation);
        if ( idInvoice )
        {
            this._translocoService.selectTranslate('invoice').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    idInvoice.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }

        const idSettingItem = this._fuseNavigationService.getItem('setting.id.0', navigation);
        if ( idSettingItem )
        {
            this._translocoService.selectTranslate('setting').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    idSettingItem.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }
        const idCategoriesItem = this._fuseNavigationService.getItem('setting.id.0.1', navigation);
        if ( idCategoriesItem )
        {
            this._translocoService.selectTranslate('categories').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    idCategoriesItem.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }
        const idClientsItem = this._fuseNavigationService.getItem('setting.id.0.2', navigation);
        if ( idClientsItem )
        {
            this._translocoService.selectTranslate('clients').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    idClientsItem.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }
        const idCompany = this._fuseNavigationService.getItem('setting.id.0.3', navigation);
        if ( idCompany )
        {
            this._translocoService.selectTranslate('company').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    idCompany.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }
        const idDocument = this._fuseNavigationService.getItem('setting.id.0.4', navigation);
        if ( idDocument )
        {
            this._translocoService.selectTranslate('document').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    idDocument.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }
        const idDocumentseries = this._fuseNavigationService.getItem('setting.id.0.5', navigation);
        if ( idDocumentseries )
        {
            this._translocoService.selectTranslate('documentseries').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    idDocumentseries.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }
        const idPaymentmethod = this._fuseNavigationService.getItem('setting.id.0.6', navigation);
        if ( idPaymentmethod )
        {
            this._translocoService.selectTranslate('paymentmethod').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    idPaymentmethod.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }
        const idPaymentdeadline = this._fuseNavigationService.getItem('setting.id.0.7', navigation);
        if ( idPaymentdeadline )
        {
            this._translocoService.selectTranslate('paymentdeadline').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    idPaymentdeadline.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }
        const idProductsItem = this._fuseNavigationService.getItem('setting.id.0.8', navigation);
        if ( idProductsItem )
        {
            this._translocoService.selectTranslate('products').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    idProductsItem.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }
        const idTypedocument = this._fuseNavigationService.getItem('setting.id.0.9', navigation);
        if ( idTypedocument )
        {
            this._translocoService.selectTranslate('typedocument').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    idTypedocument.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }

        const idBrand = this._fuseNavigationService.getItem('setting.id.0.10', navigation);
        if ( idBrand )
        {
            this._translocoService.selectTranslate('brand').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    idBrand.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }

        const idUnid = this._fuseNavigationService.getItem('setting.id.0.11', navigation);
        if ( idUnid )
        {
            this._translocoService.selectTranslate('unid').pipe(take(1))
                .subscribe((translation) => {

                    // Set the title
                    idUnid.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }

    }
}
