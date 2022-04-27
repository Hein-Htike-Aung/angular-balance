import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  loggedInUserName: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.isLoggedIn$ = this.userService.authenticated$;
    this.isLoggedIn$.subscribe({
      next: (resp) => {
        if (resp) {
          this.userService.getCurrentUser().subscribe({
            next: (resp) => {
              if (resp.name) {
                this.loggedInUserName = resp.name;
              }
            },
            error: (error) => {
              this.toastr.error(error.message);
            },
          });
        }
      },
    });
  }

  ngOnInit(): void {}

  logout() {
    this.userService.logout().subscribe({
      next: (_) => {
        this.router.navigateByUrl('/sign-in');
      },
    });
  }
}
