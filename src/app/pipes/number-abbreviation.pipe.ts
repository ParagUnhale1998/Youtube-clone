import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberAbbreviation'
})
export class NumberAbbreviationPipe implements PipeTransform {

  transform(value: any): any {
    if (value === null || isNaN(value)) {
      return '';
    }

    if (value < 1000) {
      return value.toString();
    } else if (value < 1000000) {
      return (value / 1000).toFixed(1) + 'k';
    } else if (value < 1000000000) {
      return (value / 1000000).toFixed(1) + 'm';
    } else {
      return (value / 1000000000).toFixed(1) + 'b';
    }
  }


}
