import { Injectable, signal } from '@angular/core';

export interface Notification {
  message: string;
  timestamp?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _notifications = signal<Notification[]>([]);

  notifications = this._notifications;

  add(message: string) {
    this._notifications.update((n) => [{ message, timestamp: new Date() }, ...n]);
  }

  remove(index: number) {
    this._notifications.update((n) => n.filter((_, i) => i !== index));
  }

  clear() {
    this._notifications.set([]);
  }
}
