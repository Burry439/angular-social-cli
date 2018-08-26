import { Component, OnInit, HostListener, Output, EventEmitter } from '@angular/core';
import { WebsocketService } from '../../../services/websocket.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})




export class NavbarComponent implements OnInit {

 


  constructor(private webSocketService: WebsocketService, private authService: AuthService, private router: Router) { }



  user = JSON.parse(localStorage.getItem('user'))
  navClass = "navbar-nav mr-auto"


  innerWidth:Number
  @HostListener('window:resize', ['$event'])
  onResize(event) {
  this.innerWidth = window.innerWidth;
 
  }



  logOff()
  {   
    this.authService.logOut()
    this.webSocketService.logOff(this.user)
    this.router.navigate(['/login'])
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;

  }

}
