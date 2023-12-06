import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  timeDifference(date: Date | undefined, now = new Date(), format = 'text'): string {
    if (!date) { return 'N/A'; }

    date = new Date(date);
    now = new Date(now);
    const diffMilliseconds = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (format === 'text') {
      if (diffMinutes < 1) {
        return 'just now';
      } else if (diffMinutes < 60) {
        return `${diffMinutes} minutes ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hours ago`;
      } else {
        return `${diffDays} days ago`;
      }
    } else if (format === 'seconds') {
      return `${diffMilliseconds / 1000}s`;
    } else {
      return 'N/A'
    }
  }

}
