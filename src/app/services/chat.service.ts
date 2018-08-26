import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
import {environment} from '../../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: Http) { }



  getChat(chatInfo)
  { 
     return this.http.post(environment.ws_url + 'chats/getchat',chatInfo)
     .pipe(map(res => res.json()))
  }

  }


