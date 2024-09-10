export interface ICompany {
    _id?: string;
    ruc: string;
    comercialName: string;
    department: string;
    province: string;
    district: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
}

export class Company {
    _id?: string;
    ruc: string;
    comercialName: string;
    department: string;
    province: string;
    district: string;
    status?: boolean;
    createdAt?: string;
    updatedAt?: string;
    constructor(company: ICompany){
        this._id  = company._id || null;
        this.ruc = company.ruc || null;
        this.comercialName = company.comercialName || null;
        this.department = company.department || null;
        this.province = company.province || null;
        this.district = company.district || null;
        this.status = company.status || false;
        this.createdAt = company.createdAt || null;
        this.updatedAt = company.updatedAt || null;
    }
}