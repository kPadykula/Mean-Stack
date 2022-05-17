import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Subscription} from "rxjs";

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  //@ts-ignore
  private authStatusSub: Subscription;
  isLoading = false;
  showPasswordReq = false;
  //@ts-ignore
  form: FormGroup;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );

    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
        ]
      }),
      surname: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3)
        ]
      }),
      email: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.email
        ]
      }),
      password1: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
          // 8 min , lowercase lett , uppercase lett, numbers, special char
        ]
      })
    });
  }


  onSignup() {
    if (this.form.get('password1')?.invalid)
      this.showPasswordReq = !this.showPasswordReq;

    if(this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.createUser(
      this.form.value.name,
      this.form.value.surname,
      this.form.value.email,
      this.form.value.password1
    );

  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
