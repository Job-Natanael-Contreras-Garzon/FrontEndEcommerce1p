import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Alert {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  autoClose?: boolean;
  keepAfterRouteChange?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private subject = new BehaviorSubject<Alert | null>(null);
  private defaultId = 'default-alert';

  onAlert(): Observable<Alert | null> {
    return this.subject.asObservable();
  }

  success(message: string, options?: { autoClose?: boolean, keepAfterRouteChange?: boolean }): void {
    this.alert({ type: 'success', message, ...options });
  }

  error(message: string, options?: { autoClose?: boolean, keepAfterRouteChange?: boolean }): void {
    this.alert({ type: 'error', message, ...options });
  }

  info(message: string, options?: { autoClose?: boolean, keepAfterRouteChange?: boolean }): void {
    this.alert({ type: 'info', message, ...options });
  }

  warning(message: string, options?: { autoClose?: boolean, keepAfterRouteChange?: boolean }): void {
    this.alert({ type: 'warning', message, ...options });
  }

  alert(alert: Alert): void {
    alert.autoClose = alert.autoClose !== undefined ? alert.autoClose : true;
    this.subject.next(alert);
  }

  clear(): void {
    this.subject.next(null);
  }
}