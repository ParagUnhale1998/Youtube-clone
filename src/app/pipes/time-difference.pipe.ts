import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDifference'
})
export class TimeDifferencePipe implements PipeTransform {
  transform(value: string): string {
    const currentTime = new Date();
    const pastTime = new Date(value);
    const differenceInSeconds = Math.floor((currentTime.getTime() - pastTime.getTime()) / 1000);

    if (differenceInSeconds < 60) {
      return 'just now';
    } else if (differenceInSeconds < 3600) {
      const minutes = Math.floor(differenceInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (differenceInSeconds < 86400) {
      const hours = Math.floor(differenceInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (differenceInSeconds < 2592000) { // 30 days
      const days = Math.floor(differenceInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (differenceInSeconds < 31536000) { // 365 days
      const months = Math.floor(differenceInSeconds / 2592000); // 30 days
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
      const years = Math.floor(differenceInSeconds / 31536000); // 365 days
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
  }
}