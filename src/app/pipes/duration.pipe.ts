import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(durationString: string): string {
    const matches = durationString.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    if (!matches) {
      return 'Invalid duration';
    }

    const hours = matches[1] ? parseInt(matches[1], 10) : 0;
    const minutes = matches[2] ? parseInt(matches[2], 10) : 0;
    const seconds = matches[3] ? parseInt(matches[3], 10) : 0;

    let formattedDuration = '';
    if (hours > 0) {
      formattedDuration += hours.toString() + 'h ';
    }
    if (minutes > 0) {
      formattedDuration += minutes.toString() + 'm ';
    }
    if (seconds > 0) {
      formattedDuration += seconds.toString() + 's';
    }

    return formattedDuration.trim();
  }
}