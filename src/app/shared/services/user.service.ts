import { Injectable } from '@angular/core';
import { UserModel } from '../models/user-model';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient, private _router: Router) { }

  readonly Root_URL = "https://localhost:44358";

  // register method 
  RegisterToDB(formData){

    let body: UserModel = {
      Name: formData.Name,
      Email: formData.Email,
      Password: formData.Password,
      ConfirmPassword: formData.ConfirmPassword
    }

    let reqheaders = new HttpHeaders({'No_Auth': 'true'});
    return this._http.post(this.Root_URL + '/api/account/register', body, {headers: reqheaders});
}

  // login method
  LoginToDB(formData){ 

    // use url search params in body
    let body = new URLSearchParams();
    body.set('Username', formData.Email);
    body.set('Password', formData.Password);
    body.set('grant_type', formData.grant_type);

    let reqheaders = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded' ,'No_Auth': 'true'});
    return this._http.post(this.Root_URL + '/token', body.toString(), {headers: reqheaders});
  }

  // check if user is logged in
  isUserLoggedIn(){
    if(localStorage.getItem('ACCESS_TOKEN') != null){
      return true;
    }else{
      return false;
    }
  }

  // check if user is admin
  isUserAdmin(){
    if(localStorage.getItem('ROLES') === "Admin"){
      return true;
    }else{
      return false;
    }
  }

  // logout user
  UserLogout(){
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('ROLES');
    this._router.navigate(['user/login']);
  }

}
