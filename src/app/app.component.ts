import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'balance-frontend';
  isLoggedIn$: Observable<boolean>;
  openSideBar = true;

  constructor(private userService: UserService) { 
    this.isLoggedIn$ = this.userService.authenticated$;
  }

}
