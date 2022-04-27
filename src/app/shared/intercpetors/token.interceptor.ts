import { Tokens } from './../../model/app.model';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, tap, interval } from 'rxjs';
import { catchError, switchMap, take, filter, map } from 'rxjs/operators';
import { UserService } from '../../service/user.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  isTokenRefreshing = false;
  refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private userService: UserService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (
      request.url.indexOf('signin') !== -1 ||
      request.url.indexOf('signup') !== -1 ||
      request.url.indexOf('refresh') !== -1
    ) {
      return next.handle(request);
    }

    const access_token = this.userService.getAccessToken();

    return next.handle(this.addToken(request, access_token)).pipe(
      // refresh Token
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse ||
          error.error.statusCode === 401
        ) {
          return this.handleRefreshToken(request, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token),
    });
  }

  // refresh token
  private handleRefreshToken(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.userService.refreshToken().pipe(
      switchMap((tokens: Tokens) => {
        return next.handle(this.addToken(req, tokens.access_token));
      })
    );
  }
}
