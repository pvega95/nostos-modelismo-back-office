export interface IBrandResponse {
    ok: boolean;
    message: string;
    data: IDataBrand[];
}
export interface IBrandResponseEditDelete {
    ok: boolean;
    message: string;
    data: number;
}

export interface IDataBrand {
    _id: string;
    status: boolean;
    description: string;
    abreviation: string;
    createdAt: string;
    updatedAt: string;
}
