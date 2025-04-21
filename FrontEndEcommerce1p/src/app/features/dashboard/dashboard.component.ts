import { Component, OnInit } from '@angular/core';
import { PageTitleService } from '../../core/services/page-title.service';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loading = true;
  error = '';
  totalProducts = 0;
  totalUsers = 0;
  totalOrders = 0;

  constructor(
    private pageTitleService: PageTitleService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.pageTitleService.setTitle('Dashboard');
    this.loadDashboardStats();
  }

  loadDashboardStats() {
    this.loading = true;
    this.error = '';
    this.dashboardService.getDashboardStats().subscribe({
      next: (response) => {
        if (response.success) {
          const { total_products, total_users, total_orders } = response.data;
          this.totalProducts = total_products;
          this.totalUsers = total_users;
          this.totalOrders = total_orders;
        } else {
          this.error = 'Error al cargar las estadísticas';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las estadísticas';
        this.loading = false;
        console.error('Error loading dashboard stats:', err);
      }
    });
  }
}
