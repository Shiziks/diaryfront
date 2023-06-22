import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }


  filterMonth(monthvalue: string, collection: any): any {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let monthNum = months.findIndex(month => month == monthvalue);

    let tmp = collection.filter((values: { created_at: any; }) => {
      let date = new Date(values.created_at || "");
      let month = date.getMonth();
      return month == monthNum;
    });
    return tmp;
  }

  filterYear(yearValue: number, collection: any): any {
    let tmp = collection.filter((values: { created_at: any; }) => {
      let date = new Date(values.created_at || "");
      let year = date.getFullYear();
      return year == yearValue;
    });
    return tmp;
  }
}
