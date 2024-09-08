import { AbstractControl, ValidationErrors } from "@angular/forms";

export function sinEspaciosEnBlanco(control: AbstractControl) : ValidationErrors | null {
    if(control.value != null){
        if (typeof(control.value) === 'number') {
            if((control.value as number).toString().trim().length > 0){
                return null;
            }
        } else {
            if((control.value as string).trim().length > 0){
                return null;
            }
        }
        return {sinEspaciosEnBlanco: true};
    }else{
        return null;
    }

}
