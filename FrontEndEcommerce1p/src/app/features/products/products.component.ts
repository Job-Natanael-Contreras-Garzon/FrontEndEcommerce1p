import { Component, OnInit } from '@angular/core';
import { PageTitleService } from '../../core/services/page-title.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  constructor(private pageTitleService: PageTitleService) {}

  ngOnInit() {
    this.pageTitleService.setTitle('Productos');
  }
}
