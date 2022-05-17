import {NgModule} from "@angular/core";

import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";

import {RouterModule, Routes} from "@angular/router";
import {PassComponent} from "./pass/pass.component";
import {ResetComponent} from "./pass/reset/reset.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'pass', component: PassComponent },
  { path: 'pass/:id/:token', component: ResetComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule {

}
