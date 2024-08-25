/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    },
    {
        id   : 'order',
        title: 'Order',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/order'
    },
    {
        id   : 'sale',
        title: 'Sale',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/sales'
    },
    {
        id   : 'invoice',
        title: 'Invoice',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/invoice'
    },
    {
        id   : 'setting',
        title: 'Setting',
        type : 'collapsable',
        icon : 'heroicons_outline:chart-pie',
        link : '/setting',
        children: [
            {
                id   : 'products',
                title: 'Products',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/products'
            }, 
        ]
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
