export function stringToDate(fechaInString: string): Date {
    let fecha = fechaInString.split('T')[0].split('-');
    let anio = Number(fecha[0]);
    let mes = Number(fecha[1]) - 1;
    let dia = Number(fecha[2]);

    return new Date(anio, mes, dia);
}

export function formatDate(date: Date): string {
    let day
    let month
    let year
    const d = new Date(date);
    day = '' + d.getDate();
    month = '' + (d.getMonth() + 1);
    year = d.getFullYear();
    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }
    //return [year, month, day].join('-');
    return [day, month, year].join('/');
}