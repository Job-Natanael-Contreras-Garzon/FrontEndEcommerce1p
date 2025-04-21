import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  opened = false;
  userAvatar = 'assets/img/default-avatar.png';

  constructor(private auth: AuthService) {}

  toggleSidebar() {
    this.opened = !this.opened;
  }

  logout() {
    this.auth.logout();
  }
}
