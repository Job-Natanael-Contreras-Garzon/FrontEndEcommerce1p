import { Component, OnInit } from '@angular/core';
import { PageTitleService } from '../../core/services/page-title.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  constructor(private pageTitleService: PageTitleService) {}

  ngOnInit() {
    this.pageTitleService.setTitle('Categorías');
  }
}
