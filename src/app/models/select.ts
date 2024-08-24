export interface ISelect {
    id: string | number;
    label: string;
    data?: any;
}

export class Select {
    id: string | number;
    label: string;
    data?: any;
    constructor(select: ISelect){
        this.id  = select.id || null;
        this.label = select.label || null;
        this.data = select.data || null;
    }
}