import { Component, OnInit } from '@angular/core';
import {MessageService} from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private messageService: MessageService) { }

  error(msg) {
    this.messageService.add({severity:'error', summary:msg.error, detail:msg.msg});
}


  ngOnInit() {
  }

}
