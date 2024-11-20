export interface IUnidResponse {
    ok: boolean;
    message: string;
    data: IDataUnid[];
}
export interface IUnidResponseEditDelete {
    ok: boolean;
    message: string;
    data: number;
}

export interface IDataUnid {
    _id: string;
   description: string;
   abreviation: string;
   status: boolean;
   createdAt: string;
   updatedAt: string;
}