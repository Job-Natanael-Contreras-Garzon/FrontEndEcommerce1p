import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  opened = false;

  @Output() toggleSidebar = new EventEmitter<boolean>();

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  toggle() {
    this.opened = !this.opened;
    this.toggleSidebar.emit(this.opened);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
