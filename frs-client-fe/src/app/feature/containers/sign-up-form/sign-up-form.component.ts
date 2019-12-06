import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {User} from "../../../data/user";
import {Store} from "@ngrx/store";
import {AppState, selectAuthState} from "../../../store/state/app.state";
import {SignUp} from "../../../store/actions/auth";
import {Observable} from "rxjs";

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.sass']
})
export class SignUpFormComponent implements OnInit {
  form: FormGroup;
  user: User;
  EMAIL_REGEX = '\\S+@\\S+\\.\\S+';
  getState: Observable<any>;
  errorMessage: string | null;

  passwordMatchValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
    if (formGroup.get('password').value === formGroup.get('confirmPassword').value)
      return null;
    else
      return {passwordMismatch: true};
  };

  constructor(private store: Store<AppState>) {
    this.getState = this.store.select(selectAuthState);
  }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(),
      email: new FormControl(null, [Validators.required, Validators.pattern(this.EMAIL_REGEX)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    }, {validators: this.passwordMatchValidator });

    this.getState.subscribe((state) => {
      this.errorMessage = state.errorMessage;
    });
  }

  onSubmit() {
    this.user = this.form.value;
    const payload = {
      email: this.user.email,
      password: this.user.password,
      username: this.user.username
    };
    this.store.dispatch(new SignUp(payload));
  }

}
