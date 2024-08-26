export const STATUS_ORDER = ['PENDIENTE', 'PAGADO', 'ANULADO'];

export const STATUS_STYLES = {
    PENDIENTE: {
        textColor: 'text-red-800',
        bgColor: 'bg-red-100',
    },
    PAGADO: {
        textColor: 'text-green-800',
        bgColor: 'bg-green-100',
    },
    ANULADO: {
        textColor: 'text-white-800',
        bgColor: 'bg-gray-100',
    },
};

export interface StatusModel {
    textColor: string;
    bgColor: string;
}