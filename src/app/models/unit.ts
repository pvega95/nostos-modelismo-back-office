export interface IUnit {
    _id?: string;
    description: string;
    abreviation: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
}

export class Unit {
    _id?: string;
    description: string;
    abreviation: string;
    status: boolean;
    createdAt?: string;
    updatedAt?: string;
    constructor(unit: Unit) {
        this._id  = unit._id || null;
        this.description = unit.description || null;
        this.abreviation = unit.abreviation || null;
        this.status = unit.status || false;
        this.createdAt = unit.createdAt || null;
        this.updatedAt = unit.updatedAt || null;
    }
}
