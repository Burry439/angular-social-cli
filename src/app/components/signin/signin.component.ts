import { Component, OnInit, ViewChild,Output,EventEmitter } from '@angular/core';
import { NgForm,FormBuilder, FormGroup, } from '@angular/forms';
import { Http, Headers } from '@angular/http';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  
  @Output() error = new EventEmitter();



  constructor(private http: Http,
     private authService: AuthService,
      private router: Router,
) { }

  ngOnInit() {
  }


  @ViewChild('f')signinform:NgForm

  password:string
  email:string

  onSignIn()
  { 
    
    const user = 
    {
      password: this.signinform.value.password,
      email: this.signinform.value.email,
    }

    this.authService.authenticateUser(user).subscribe((res) =>{
        if(res.success)   
        { 
          this.authService.storeData(res.token, res.user)
          this.router.navigate(['/home/dashboard'])
        }
        else if(res.loggedIn && !res.success)
        {     
          return  this.error.emit({error:'Already logged in' ,msg:"someone is already logged in to this account"})
           
        }
       else  if (!res.success)
        { 
          return this.error.emit({error:'Wrong info' ,msg:"the email or password is incorrect"})
        }
       
    })
    
    
   
  }


}