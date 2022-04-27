import { CategoryPayload } from './../model/app.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const API = `${environment.apiUrl}/categories`;

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  create(categoyPayload: CategoryPayload) {
    return this.http.post(`${API}`, categoyPayload);
  }

  getAll(balances?: string) {
    return balances
      ? this.http.get<CategoryPayload[]>(`${API}?balances`)
      : this.http.get<CategoryPayload[]>(`${API}`);
  }

  getById(id: string, balances?: string) {
    return balances
      ? this.http.get(`${API}/${id}?balances`)
      : this.http.get(`${API}/${id}`);
  }

  update(id: string, categoryPayload: Partial<CategoryPayload>) {
    return this.http.patch(`${API}/${id}`, categoryPayload);
  }

  updateSubCategory(id: string, category: { parentCategoryId: string }) {
    return this.http.patch(`${API}/${id}`, category);
  }

  delete(id: string) {
    return this.http.delete(`${API}/${id}`);
  }
}
