import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class WebsocketService {

  // Our socket connection
  socket:any;


  constructor(private http: HttpClient) { }
////connects to socket when app starts//////////
  connect(){
    this.socket = io(environment.ws_url);
        return () => {
          this.socket.disconnect("another dude");
        }
  }
///////////////////////////////////////////////



  logOff(user)
  {
    this.socket.emit('log-off', user)
  }


  userWentOnline(user)
  {
    this.socket.emit("user-conneted", user)
  }


  stillOnline(user)
  {
    this.socket.emit("user-still-online", user)
  }

  message(chatInfo)
  { 
    this.socket.emit('message',chatInfo)
  }

  addPost(postInfo)
  {
    this.socket.emit('new-post',postInfo)
  }

  deletePost(postId)
  {
    this.socket.emit('delete-post', postId)
  }

  editPost(postInfo)
  {
    this.socket.emit('edit-post', postInfo)
  }

  addComment(commentInfo)
  { 
    
    this.socket.emit('add-new-comment', commentInfo)
  }
 
 deleteComment(commentId)
  { 
    
    this.socket.emit('delete-comment', commentId)
  }

  editComment(CommentInfo)
  { 
    
    this.socket.emit('edit-comment', CommentInfo)
  }

  seen(messageInfo)
  {
    this.socket.emit('seen-message', messageInfo)
  }

  typing(messageInfo)
  {
    this.socket.emit('typing',messageInfo)
  }


  postWithPhoto(res)
  {
    this.socket.emit('image', res)
  }



  changedProfilePic(profilePic, id, firstname, lastname)
  {
    this.socket.emit('new-profilePic', profilePic, id, firstname,lastname)
  }

  changedWallPic(profilePic, id, firstname, lastname)
  {
    this.socket.emit('new-wallPic', profilePic, id, firstname,lastname)
  }

}