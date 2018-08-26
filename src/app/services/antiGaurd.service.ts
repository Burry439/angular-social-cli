import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable()
export class AntiGaurdService implements CanActivate
{   
    constructor(
        private router:Router,
        private authService: AuthService ){}

    canActivate()
    {   
        if(this.authService.isLoggedIn())
        {   
            this.router.navigate(['home/dashboard'])
            return false
            
        }
        else
        {
           return true
    }


}
}