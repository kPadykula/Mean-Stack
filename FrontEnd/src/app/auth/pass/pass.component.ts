import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {PassresetService} from "./passreset.service";

@Component({
  templateUrl: './pass.component.html',
  styleUrls: ['./pass.component.scss']
})
export class PassComponent implements OnInit {
  isLoading = false;

  constructor(
    private resetService: PassresetService
  ) { }

  ngOnInit(): void {

  }

  onReset(form: NgForm) {
    if (form.invalid)
      return;

    this.isLoading = true;
    this.resetService.sendEmail(form.value.email);
  }

}
