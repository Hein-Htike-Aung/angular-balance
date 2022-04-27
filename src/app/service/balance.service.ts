import { BalancePayload } from './../model/app.model';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

const API = `${environment.apiUrl}/balances`;

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  constructor(private http: HttpClient) {}

  create(balancePayload: BalancePayload) {
    return this.http.post<BalancePayload>(`${API}`, balancePayload);
  }

  /* 
      account: boolean;
      category: boolean;
      user: boolean;
  */
  getAll(balanceQuery?: string) {
    return balanceQuery
      ? this.http.get<BalancePayload[]>(`${API}?${balanceQuery}`)
      : this.http.get<BalancePayload[]>(`${API}`);
  }

  getById(id: string, balanceQuery?: string) {
    return balanceQuery
      ? this.http.get(`${API}/${id}?${balanceQuery}`)
      : this.http.get(`${API}/${id}`);
  }

  update(id: string, balancePaylod: BalancePayload) {
    return this.http.patch(`${API}/${id}`, balancePaylod);
  }

  delete(id: string) {
    return this.http.delete(`${API}/${id}`);
  }
}
