import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  private titleSubject = new BehaviorSubject<string>('');
  public title$ = this.titleSubject.asObservable();

  setTitle(title: string) {
    if (title !== this.titleSubject.value) {
      this.titleSubject.next(title);
    }
  }

  getTitle(): string {
    return this.titleSubject.value;
  }
}