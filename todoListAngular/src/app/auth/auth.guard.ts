import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "./auth.service";
import { map, Observable, take, tap } from "rxjs";
import { devNull } from "node:os";


@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate{

  constructor(private authService:AuthService,private router:Router){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean |UrlTree> {
    if(localStorage.getItem('userData')!=null){
      return true
    }
    return this.authService.user.pipe(take(1),map(user=>{
      const isAuth = !!user;
      if(!isAuth){
        this.router.navigate(['/logIn']);
      }
      return true;
    })
  );
  }

}
