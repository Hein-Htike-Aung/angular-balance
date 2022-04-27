import { Observable } from 'rxjs';
import { UserService } from './../../service/user.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {

    isLoggedIn$: Observable<boolean>;

    constructor(userService: UserService, private router: Router) {
        this.isLoggedIn$ = userService.authenticated$;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        this.isLoggedIn$.subscribe(resp => {
            if (resp) {
                return true;
            } else {
                this.router.navigateByUrl("sign-in");
                return false;
            }
        })

        return true;
    }
}