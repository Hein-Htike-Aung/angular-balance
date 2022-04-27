import { UserPayload } from './../../model/app.model';
import { UserService } from './../../service/user.service';
import { ErrorMatcher } from './../../shared/utils/error-matcher';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  matcher = new ErrorMatcher();
  signupForm: FormGroup;
  authDto: UserPayload;

  constructor(
    private builder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.builder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  signup() {
    this.authDto = this.signupForm.value;

    this.userService.signup(this.authDto).subscribe({
      next: (_) => {
        this.router.navigateByUrl('/sign-in');
      },
      error: (error) => {
        this.toastr.error(error.message);
      },
    });
  }
}
