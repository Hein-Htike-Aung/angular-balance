import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import {
  BehaviorSubject,
  map,
  Observable, tap
} from 'rxjs';
import { environment } from '../../environments/environment';
import { CredentialInfoPayload, Tokens, UserPayload } from './../model/app.model';

const API = `${environment.apiUrl}/auth`;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly authenticated = new BehaviorSubject<boolean>(false);
  authenticated$ = this.authenticated.asObservable();

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService
  ) { }

  signup(authDto: UserPayload): Observable<Tokens> {
    return this.http.post<Tokens>(`${API}/signup`, authDto);
  }

  signin(authDto: UserPayload): Observable<any> {
    console.log(authDto);
    return this.http.post<Tokens>(`${API}/signin`, authDto).pipe(
      map((resp) => {
        this.localStorage.store('access_token', resp.access_token);
        this.localStorage.store('refresh_token', resp.refresh_token);
        this.authenticated.next(true);
        return true;
      })
    );
  }

  logout() {
    return this.http.post(`${API}/logout`, '').pipe(
      tap((_) => {
        this.localStorage.clear('access_token');
        this.localStorage.clear('refresh_token');
        this.authenticated.next(false);
      })
    );
  }

  refreshToken() {
    return this.http
      .post<Tokens>(`${API}/refresh`, '', {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + this.getRefreshToken(),
        }),
      })
      .pipe(
        tap((resp) => {
          this.localStorage.clear('access_token');
          this.localStorage.clear('refresh_token');

          this.localStorage.store('access_token', resp.access_token);
          this.localStorage.store('refresh_token', resp.refresh_token);
        })
      );
  }

  changeCredential(credentialInfoPayload: CredentialInfoPayload) {
    return this.http.post(`${API}/change-credential`, credentialInfoPayload);
  }

  getCurrentUser() {
    return this.http.get<UserPayload>(`${API}/me`);
  }

  getAccessToken() {
    return this.localStorage.retrieve('access_token');
  }

  getRefreshToken() {
    return this.localStorage.retrieve('refresh_token');
  }
}
