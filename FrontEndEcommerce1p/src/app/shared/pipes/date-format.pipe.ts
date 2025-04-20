import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: Date, format: string): string {
    // Implementación del pipe
    return ''; // Ejemplo
  }
}