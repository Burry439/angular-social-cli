import { Component, OnInit, ViewChild,Output,EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Http, Headers } from '@angular/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user:any
  @Output() error = new EventEmitter();

  constructor(private http: Http, 
    private authService:AuthService,
     private router: Router,
    ){}

  ngOnInit() {
  }


  

  @ViewChild('f')signupform:NgForm


  logInafterRegister()
  {
    this.authService.authenticateUser(this.user).subscribe((data:any)=>{
      if(data.success)
           {
              this.authService.storeData(data.token,data.user)
              this.router.navigate(['/home/dashboard'])
           }
         
    })
    
  }

  onRegisterSubmit()
  { 
    this.user =
    {
      firstname: this.signupform.value.firstname,
      password: this.signupform.value.password,
      lastname: this.signupform.value.lastname,
      email: this.signupform.value.email, 
      online: false
    }  
   this.authService.registerUser(this.user).subscribe((res:any) =>{  
     if(res.success == "false")
     {  
      this.error.emit({error:'Email in use' ,msg:"This email has already been used to mke an account"})

     }
     else
     {
      this.logInafterRegister()
     }
  })
 
}

}
