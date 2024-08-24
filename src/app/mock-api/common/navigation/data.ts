/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboards.analytics',
        title: 'Analytics',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dashboards/analytics'
    },
/*     {
        id   : 'order.id',
        title: 'order',
        type : 'basic',
        icon : 'heroicons_outline:clipboard-list',
        link : '/order'
    }, */
    {
        id   : 'salenote.id',
        title: 'salenote',
        type : 'basic',
        icon : 'heroicons_outline:document-text',
        link : '/salenote'
    },
    {
        id   : 'invoice.id',
        title: 'invoice',
        type : 'basic',
        icon : 'heroicons_outline:document-text',
        link : '/invoice'
    },
    {
        id      : 'setting.id.0',
        title   : 'setting',
        icon    : 'heroicons_outline:cog',
        type    : 'collapsable',
        children: [
            {
                id      : 'setting.id.0.1',
                title   : 'categories',
                type    : 'basic',
                link : '/setting/categories'
            },
            {
                id      : 'setting.id.0.2',
                title   : 'clients',
                type    : 'basic',
                link : '/setting/clients'
            },
            {
                id      : 'setting.id.0.3',
                title   : 'company',
                type    : 'basic',
                link : '/setting/company'
            }, 
            {
                id      : 'setting.id.0.4',
                title   : 'document',
                type    : 'basic',
                link : '/setting/document'
            }, 
            {
                id      : 'setting.id.0.5',
                title   : 'documentseries',
                type    : 'basic',
                link : '/setting/documentseries'
            }, 
            {
                id      : 'setting.id.0.10',
                title   : 'brand',
                type    : 'basic',
                link : '/setting/brand'  
            },
            {
                id      : 'setting.id.0.6',
                title   : 'paymentmethod',
                type    : 'basic',
                link : '/setting/paymentmethod'  
            },
            {
                id      : 'setting.id.0.12',
                title   : 'Pasarela',
                type    : 'collapsable',
                children: [
                    {
                        id   : 'setting.id.0.12.1',
                        title: 'Billetera Electronica',
                        type : 'basic',
                        link : '/setting/payment-gateway/wallet'
                    },
                    {
                        id   : 'setting.id.0.12.2',
                        title: 'Cuentas Bancarias',
                        type : 'basic',
                        link : '/setting/payment-gateway/account-bank'
                    },
                ]
            }, 
            {
                id      : 'setting.id.0.7',
                title   : 'paymentdeadline',
                type    : 'basic',
                link : '/setting/paymentdeadline'  
            },  
            {
                id      : 'setting.id.0.8',
                title   : 'products',
                type    : 'basic',
                link : '/setting/products'
            },
            {
                id      : 'setting.id.0.9',
                title   : 'typedocument',
                type    : 'basic',
                link : '/setting/typedocument'  
            },

            {
                id      : 'setting.id.0.11',
                title   : 'unid',
                type    : 'basic',
                link : '/setting/unid'  
            }
        ]
    },


 /*    {
        id      : 'dashboards',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'dashboards.project',
                title: 'Project',
                type : 'basic',
                icon : 'heroicons_outline:clipboard-check',
                link : '/dashboards/project'
            }, 
            {
                id   : 'dashboards.analytics',
                title: 'Analytics',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/dashboards/analytics'
            }
        ]
    }, */

 
 
 /*    {
        id  : 'divider-1',
        type: 'divider'
    }, */
 
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        tooltip : 'Dashboards',
        type    : 'aside',
        icon    : 'heroicons_outline:home',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'apps',
        title   : 'Apps',
        tooltip : 'Apps',
        type    : 'aside',
        icon    : 'heroicons_outline:qrcode',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'pages',
        title   : 'Pages',
        tooltip : 'Pages',
        type    : 'aside',
        icon    : 'heroicons_outline:document-duplicate',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'user-interface',
        title   : 'UI',
        tooltip : 'UI',
        type    : 'aside',
        icon    : 'heroicons_outline:collection',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'navigation-features',
        title   : 'Navigation',
        tooltip : 'Navigation',
        type    : 'aside',
        icon    : 'heroicons_outline:menu',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'DASHBOARDS',
        type    : 'group',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'apps',
        title   : 'APPS',
        type    : 'group',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id   : 'others',
        title: 'OTHERS',
        type : 'group'
    },
    {
        id      : 'pages',
        title   : 'Pages',
        type    : 'aside',
        icon    : 'heroicons_outline:document-duplicate',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'user-interface',
        title   : 'User Interface',
        type    : 'aside',
        icon    : 'heroicons_outline:collection',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'navigation-features',
        title   : 'Navigation Features',
        type    : 'aside',
        icon    : 'heroicons_outline:menu',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'apps',
        title   : 'Apps',
        type    : 'group',
        icon    : 'heroicons_outline:qrcode',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'pages',
        title   : 'Pages',
        type    : 'group',
        icon    : 'heroicons_outline:document-duplicate',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'user-interface',
        title   : 'UI',
        type    : 'group',
        icon    : 'heroicons_outline:collection',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'navigation-features',
        title   : 'Misc',
        type    : 'group',
        icon    : 'heroicons_outline:menu',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    }
];
