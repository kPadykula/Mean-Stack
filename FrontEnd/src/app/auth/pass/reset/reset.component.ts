import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {PassresetService} from "../passreset.service";

@Component({
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

  isLoading = false;
  //@ts-ignore
  form: FormGroup;
  correctSecondPassword = false;
  //@ts-ignore
  private id: string | null;
  //@ts-ignore
  private token: string | null;
  showPasswordReq = false;

  constructor(
    private route: ActivatedRoute,
    private resetService: PassresetService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      password1: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
          // 8 min , lowercase lett , uppercase lett, numbers, special char
        ]
      })
    });

    this.route.paramMap
      .subscribe((paramMap: ParamMap) => {
        if (paramMap.has('id')) {
          this.id = paramMap.get('id');
          if (paramMap.has('token'))
            this.token = paramMap.get('token');
          else
            this.router.navigate(['/']);
        } else
          this.router.navigate(['/']);
      });
  }

  onReset() {
    if (this.form.invalid) {
      this.showPasswordReq = !this.showPasswordReq;
      return;
    }

    this.isLoading = true;

    this.resetService.resetPassword(this.id, this.token, this.form.value.password1);
  }
}
