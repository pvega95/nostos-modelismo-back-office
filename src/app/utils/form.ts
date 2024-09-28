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
/**
 * @description retira las tildes de un string
 * @param value string
 * @returns string
 */
export const parseStringSinTildes = (value: string): string => {
    const accent_map = {'á':'a', 'é':'e', 'è':'e', 'í':'i','ó':'o','ú':'u','Á':'a', 'É':'e', 'Í':'i','Ó':'o','Ú':'u'};
    let valueParse: string = '';

    if (!value) { return ''; }

    for (var i = 0; i < value.length; i++) {
        valueParse += accent_map[value.charAt(i)] || value.charAt(i);
    }

  return valueParse;
}