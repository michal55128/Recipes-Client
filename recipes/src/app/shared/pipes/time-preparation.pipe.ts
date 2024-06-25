import { Pipe, PipeTransform } from '@angular/core';
import { totalmem } from 'os';

@Pipe({
  name: 'timePreparation',
  standalone: true,
})
export class TimePreparationPipe implements PipeTransform {
  transform(minutes: number | undefined): string {
    let totalTime = '';
    if (minutes) {
      const houres = Math.floor(minutes / 60);
      const minuteO = minutes % 60;
      if (houres > 0) {
        totalTime += `${houres} houres`;
        if (minuteO > 0) {
          totalTime += ` and ${minuteO} minutes`;
        }
      } else {
        totalTime += `${minuteO} minutes`;
      }
    }
    return totalTime;
  }
}
