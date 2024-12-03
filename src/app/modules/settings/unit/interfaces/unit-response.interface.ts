export interface IUnitResponse {
    ok: boolean;
    message: string;
    data: IDataUnit[];
}
export interface IUnitResponseEditDelete {
    ok: boolean;
    message: string;
    data: number;
}

export interface IDataUnit {
    _id: string;
   description: string;
   abreviation: string;
   status: boolean;
   createdAt: string;
   updatedAt: string;
}