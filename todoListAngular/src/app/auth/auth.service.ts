import { TaskService } from './../task/task-service';
import { Injectable } from "@angular/core";
import { ApiKey } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { AuthResponseData } from "./auth-response.model";
import { BehaviorSubject, tap } from "rxjs";
import { User } from "./user.model";

@Injectable({providedIn: 'root'})
export class AuthService{

  private signUpBaseAPIUrl=`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${ApiKey}`;
  private signInBaseAPIUrl=`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${ApiKey}`;
  user = new BehaviorSubject<User|null>(null);


  constructor(private http:HttpClient){}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(this.signUpBaseAPIUrl, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(tap(result => {
      this.handleAuthentication(result.email, result.localId, result.idToken, +result.expiresIn);

    }));
  }

  signin(email: string, password: string) {
    return this.http.post<AuthResponseData>(this.signInBaseAPIUrl, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(tap(result => {
      this.handleAuthentication(result.email, result.localId, result.idToken, +result.expiresIn);
    }));
  }

  logout() {
    localStorage.removeItem('userData');
    this.user.next(null);
  }

  autoLogin(){
    if(localStorage.getItem('userData')==null){
      return;
    }
    const userData :{
      email:string,
      id:string,
      _token:string,
      _tokenExpirationDate:string
    }= JSON.parse(localStorage.getItem('userData')!);
    if(!userData){
      return;
    }
    else{
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
        if(loadedUser.token){
          this.user.next(loadedUser);
    }
  }
}

  private handleAuthentication(email:string, userId:string, token:string, expiresIn:number){
    this.user.next(new User(email, userId, token, new Date(new Date().getTime() + +expiresIn * 1000)));
    localStorage.setItem('userData', JSON.stringify(this.user.getValue()));
    this.autoLogin();
  }
}
