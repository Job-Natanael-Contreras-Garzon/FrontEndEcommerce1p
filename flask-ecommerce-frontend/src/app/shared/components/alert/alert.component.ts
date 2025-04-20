import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { Alert, AlertService } from './alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() id = 'default-alert';
  @Input() fade = true;
  alerts: Alert[] = [];
  alertSubscription!: Subscription;
  routeSubscription!: Subscription;

  constructor(private router: Router, private alertService: AlertService) {}

  ngOnInit(): void {
    this.alertSubscription = this.alertService.onAlert().subscribe(alert => {
      if (!alert) { this.alerts = []; return; }
      this.alerts.push(alert);
      if (alert.autoClose) setTimeout(() => this.removeAlert(alert), 5000);
    });
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) this.alertService.clear();
    });
  }
  ngOnDestroy(): void {
    this.alertSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }
  removeAlert(alert: Alert) {
    this.alerts = this.alerts.filter(x => x !== alert);
  }
  cssClass(alert: Alert): string {
    const base = ['alert','alert-dismissible'];
    base.push({
      success: 'alert-success',
      error:   'alert-danger',
      info:    'alert-info',
      warning: 'alert-warning'
    }[alert.type] || '');
    return base.join(' ');
  }
}
