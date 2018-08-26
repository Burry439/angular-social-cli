import { Component, OnInit,ViewEncapsulation,HostListener,Input, Output } from '@angular/core';
import { WebsocketService } from '../../../services/websocket.service';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  innerWidth:Number
  @HostListener('window:resize', ['$event'])
  onResize(event) {
  this.innerWidth = window.innerWidth;
}


  constructor(private webSocketService: WebsocketService ) { }


  display:boolean
  me = JSON.parse(localStorage.getItem('user'))
  you:String
  onlineUsers = []
  messages = []
  openChats:any[] = []


  filterArray(array,str)
  {

    return array.filter((user)=>{

        let fullname = user.firstname + " " + user.lastname

       return fullname.toLowerCase().includes(str.toLowerCase())
    })
  
  }
  


  playSound()
{
  let audio = new Audio();
  audio.src = "../assets/sounds/message.mp3";
  audio.load();
  audio.play();
}

  ngOnInit() {



    this.innerWidth = window.innerWidth;

    this.webSocketService.connect()
 
    this.webSocketService.userWentOnline(this.me.id)
  
    this.webSocketService.socket.on('updated-list', (data)=>{
      if(!this.onlineUsers.includes(data._id))
      {
        this.onlineUsers = data
      }
      
    })


    this.webSocketService.socket.on('got-message', (data)=>{
      this.playSound()
      this.openChat(data)
    })



  }


  openChat(user)
  { 

        this.display = false;
        ////depending if you send or recive a message the user param will vary
        let id;
        if(user._id != undefined)
        {

          id = user._id
        }
        else
        {

          id = user.id
        }
       ////////////////////////////////////////////////////////////


        let shouldAdd = true
        for(let i = 0; i < this.openChats.length; i++)
        {

          if(this.openChats[i].id == id || this.openChats[i]._id == id)
          {
            shouldAdd = false
            break
          }
        }
        if(shouldAdd)
        {
          this.you = user
          this.openChats.push(user)
        }
    
  }



  closeChat(chatInfo)
  { 

    for(let i = 0; i < this.openChats.length; i++)
    {   
        if(this.openChats[i]._id == chatInfo.you._id)
        { 
           this.openChats.splice(i,1)
           this.webSocketService.socket.emit("left-room",chatInfo.roomId)

        }
    }
  }



}
