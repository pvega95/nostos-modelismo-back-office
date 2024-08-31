/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'example.id',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    },
    {
        id   : 'order.id',
        title: 'Order',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/order'
    },
    {
        id   : 'sale.id',
        title: 'Sale',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/sales'
    },
    {
        id   : 'invoice.id',
        title: 'Invoice',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/invoice'
    },
    {
        id   : 'setting.id',
        title: 'Setting',
        type : 'collapsable',
        icon : 'heroicons_outline:cog-8-tooth',
        link : '/setting',
        children: [
            {
                id   : 'setting.products.id',
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
