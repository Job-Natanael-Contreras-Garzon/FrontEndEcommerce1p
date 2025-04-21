import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, AfterContentChecked, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../../core/services/auth.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements AfterViewInit, AfterContentChecked, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  currentTitle: string = '';
  private titleSubscription?: Subscription;
  
  constructor(
    private auth: AuthService,
    private router: Router,
    private pageTitleService: PageTitleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    if (window.innerWidth > 768) {
      setTimeout(() => this.sidenav.open(), 0);
    }
  }

  ngAfterContentChecked() {
    if (!this.titleSubscription) {
      this.titleSubscription = this.pageTitleService.title$.subscribe(title => {
        if (this.currentTitle !== title) {
          this.currentTitle = title;
          try {
            this.cdr.detectChanges();
          } catch (e) {
            // Handle potential ExpressionChangedAfterItHasBeenCheckedError
            setTimeout(() => this.cdr.detectChanges(), 0);
          }
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
    }
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
