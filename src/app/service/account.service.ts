import { AccountPayload } from './../model/app.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const API = `${environment.apiUrl}/accounts`;

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private http: HttpClient) {}

  createAccount(accountPayload: AccountPayload) {
    return this.http.post(`${API}`, accountPayload);
  }

  getAll(balances?: string) {
    return balances
      ? this.http.get<AccountPayload[]>(`${API}?balances`)
      : this.http.get<AccountPayload[]>(`${API}`);
  }

  findById(id: string) {
    return this.http.get<AccountPayload>(`${API}/${id}`);
  }

  update(id: string, accountPayload: Partial<AccountPayload>) {
    return this.http.patch(`${API}/${id}`, accountPayload);
  }

  delete(id: string) {
    return this.http.delete(`${API}/${id}`);
  }
}
