import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";


import {AuthRoutingModule} from "./auth-routing.module";
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";
import {AngularMaterialModule} from "../angular-material.module";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { PassComponent } from './pass/pass.component';
import { ResetComponent } from './pass/reset/reset.component';
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    PassComponent,
    ResetComponent,
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        AuthRoutingModule,
        MatIconModule
    ]
})
export class AuthModule {

}
