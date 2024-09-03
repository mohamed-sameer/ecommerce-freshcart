import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPip',
  standalone: true,
})
export class SearchPipPipe implements PipeTransform {
  transform(arrData: any[], term: string): any[] {
    return arrData.filter((item) =>
      item.title.toLowerCase().includes(term.toLowerCase())
    );
  }
}
