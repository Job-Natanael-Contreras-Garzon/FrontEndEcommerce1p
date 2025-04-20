import { Injectable } from '@angular/core';
import { HttpClient }    from '@angular/common/http';
import { environment }   from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  get<T>(path: string) {
    return this.http.get<T>(`${this.baseUrl}${path}`);
  }
  post<T>(path: string, body: any) {
    return this.http.post<T>(`${this.baseUrl}${path}`, body);
  }
  // puedes añadir put, delete…
}
