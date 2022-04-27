import { ToastrService } from 'ngx-toastr';
import { UserPayload } from './../../model/app.model';
import { UserService } from './../../service/user.service';
import { Router } from '@angular/router';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { ErrorMatcher } from './../../shared/utils/error-matcher';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  matcher = new ErrorMatcher();
  signinForm: FormGroup;
  authDto: UserPayload;

  constructor(
    private builder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.signinForm = this.builder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  signin() {
    this.authDto = this.signinForm.value;
    this.userService.signin(this.authDto).subscribe({
      next: (_) => {
          this.router.navigateByUrl('/master/dashboard');
      },
      error: (error) => {
        this.toastr.error(error.error.message);
      },
    });
  }
}
