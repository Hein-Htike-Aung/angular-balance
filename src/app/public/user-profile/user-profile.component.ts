import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserPayload, CredentialInfoPayload } from './../../model/app.model';
import { UserService } from './../../service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user: UserPayload;
  credentialPayload: CredentialInfoPayload;
  credentialInfoForm: FormGroup;

  constructor(private builder: FormBuilder, private userService: UserService, private toastr: ToastrService, private router: Router) {
    this.userService.getCurrentUser().subscribe(resp => {
      this.user = resp;
      this.credentialInfoForm = this.builder.group({
        name: [this.user?.name, Validators.required],
        email: [this.user?.email, [Validators.required, Validators.email]],
        oldPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        repeatedPassword: ['', Validators.required]
      });

    });
  }

  ngOnInit(): void {

  }

  save() {

    if (this.credentialInfoForm.value.newPassword !== this.credentialInfoForm.value.repeatedPassword) {
      this.toastr.error('Password doesn\'t match');
      return;
    }

    this.credentialPayload = this.credentialInfoForm.value;
    this.userService.changeCredential(this.credentialPayload).subscribe({
      next: resp => {
        this.userService.logout().subscribe({
          next: (_) => {
            this.router.navigateByUrl('/sign-in');
          },
        });
      },
      error: (error) => {
        this.toastr.error(error.error.message);
      }
    })
  }

}
