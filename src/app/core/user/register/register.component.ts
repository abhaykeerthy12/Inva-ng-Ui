import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  private _subscription: Subscription;
  showAlert: boolean = false;
  errorvar: any;
  
  constructor(private _formBuilder: FormBuilder, private _router: Router, private _userService: UserService) {}

  ngOnInit() {
    this.CreateForm();
  }

  RegisterForm: FormGroup;

  CreateForm(){

    return this.RegisterForm = this._formBuilder.group({
      Name: ['', Validators.required],
      Email: ['',[ Validators.required, Validators.email ]],
      Password: ['', [ Validators.required, Validators.minLength(6) ]],
      ConfirmPassword: ['', [ Validators.required, Validators.minLength(6) ]]
    });

  }

  Register(){

    // check if form is empty
    if(this.RegisterForm.invalid){
      this.ShowError('Fields are empty');
      return false;
    }

    this._subscription = this._userService.RegisterToDB(this.RegisterForm.value).subscribe(
      success => {
        this._router.navigate(['/user/login']);
      },
      (error: HttpErrorResponse) => {
        if(error){
          if(error.status == 400){
            this.ShowError('Invalid Credentials');
          }
        }
    }
    );
  }

  ShowError(error){

    this.errorvar = error;
    this.showAlert = true;
    setTimeout(()=>{ 
      this.showAlert = false;
    }, 5000);
}


  resetForm() {
    this.RegisterForm.reset();
  }

  ngOnDestroy(){
    if(this._subscription != null)
      this._subscription.unsubscribe();
  }


}
