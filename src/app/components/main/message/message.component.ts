import { Component, OnInit, Input, Output,EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { WebsocketService } from '../../../services/websocket.service';
import { ChatService } from '../../../services/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @Output() Chatclose:EventEmitter<any> = new EventEmitter()
  @Input() you
  me = JSON.parse(localStorage.getItem('user'))
  correctStyle = "direct-chat-msg left"
  sawMsg:Boolean = false
  isTyping:Boolean = false
  timer:any
  ////


  msg:String

  chat:any

  recivedMsg:String = "../assets/sounds/message.mp3";
  sentMsg:String = "../assets/sounds/sent-message.mp3";
  someonetIsTyping:String = "../assets/sounds/typing.mp3"
  seenMsg:String = "../assets/sounds/seen.mp3"


    youId:String

  @ViewChild('chatElement') chatElement: ElementRef;

  playSound(sound)
{
  let audio = new Audio();
  audio.src = sound;
  audio.loop = false
  audio.load();
  audio.play();
}


  minus:boolean
  roomId:String

  constructor(private webSocketService: WebsocketService, private chatService: ChatService, private router: Router) { 


    this.longScrollToBottom()
    this.chat = {roomId:"",messages:[]}

  }




  toOtherProfile(id)
  {   
      if(id != this.me.id)
      {
        this.router.navigate(['/home/otherprofile', id])
      }
      else
      {
        this.router.navigate(['/home/profile'])
      }
    
  }



  scrollToBottom()
  {
    setTimeout(() => {
      this.chatElement.nativeElement.scrollTop = this.chatElement.nativeElement.scrollHeight;
    }, 100);
  }
  longScrollToBottom()
  {
    setTimeout(() => {
      this.chatElement.nativeElement.scrollTop = this.chatElement.nativeElement.scrollHeight;
    }, 500);
  }











  closeChat()
  { 
    
    let chatInfo = {me:this.me,you:this.you,roomId:this.roomId}

    this.Chatclose.emit(chatInfo)
  }



  toggleChat()
  {
 
    this.minus = !this.minus;

    if(!this.minus)
    {
      this.scrollToBottom()
    }

  }



  message()
  { 

    this.scrollToBottom()


      var newDate = new Date();
      var date = newDate.getFullYear() + "/" + (newDate.getMonth() + 1) + "/" + newDate.getDate();
      var time = newDate.getHours() + ":" + newDate.getMinutes();
    this.webSocketService.message({msg:this.msg, me:this.me, you:this.you, date:date, time:time})
    this.msg = "";
    this.playSound(this.sentMsg)
  }


  seen()
  { 
    if(this.chat.messages.length > 0 && (this.chat.messages[this.chat.messages.length - 1].from != this.me.id) && (this.chat.messages[this.chat.messages.length - 1].seen == false))
    {
      this.webSocketService.seen({msg:this.msg, me:this.me, you:this.you})
    }
  
  }

  typing()
  {
    this.webSocketService.typing({msg:this.msg, me:this.me, you:this.you})
  }


  timeOut()
  { 
    this.timer = setTimeout(()=>{ 
      this.isTyping = false; 
    }, 
      1000);
  }

  clearTimeOut()
  {   
      window.clearTimeout(this.timer);
  }

  ngOnInit() {



    this.chatService.getChat({me:this.me.id, you:this.you}).subscribe((res)=>{

      

        if(this.you._id == undefined)
        {
            this.youId = this.you.id
        }
        else
        {
          this.youId = this.you._id
        }


        console.log(this.you)

       if(res[0] != undefined)
       {
           this.roomId = res[0]._id
           this.chat.roomId = this.roomId
           for(let i = 0; i < res[0].messages.length; i++)
           {
             this.chat.messages.push(res[0].messages[i])
           }

       }
       else
       {  
          this.roomId = res._id
          this.chat.roomId = this.roomId

          for(let i = 0; i < res.messages.length; i++)
          {
            this.chat.messages.push(res.messages[i].message)
          }
       }


      this.webSocketService.socket.emit('join-room', this.roomId)
    })


    this.webSocketService.socket.on('message', (data)=>{
       this.sawMsg = false
       this.isTyping = false
        let newMessage = {message:data.chat.msg, from:data.chat.from, date:data.chat.date, time:data.chat.time, seen:data.chat.seen}

        if(this.chat.roomId == data.chat.roomId)
        { 
          this.chat.messages.push(newMessage)
          if(newMessage.from != this.me.id)
          { 
            this.playSound(this.recivedMsg)

          }
          this.longScrollToBottom()
        }
    })


    this.webSocketService.socket.on('saw-message',(roomId,from)=>{
      if(this.chat.roomId == roomId)
      {
        this.chat.messages[this.chat.messages.length - 1].seen = true
        this.scrollToBottom()
        if(from != this.me.id)
        { 
          this.playSound(this.seenMsg)
        }
        
      }
  
    })


    this.webSocketService.socket.on('typing',(roomId)=>{
      if(this.chat.roomId == roomId)
      { 

        this.clearTimeOut()
        this.timeOut()

        this.scrollToBottom()
        this.isTyping = true
        this.playSound(this.someonetIsTyping)
      }
    })


  }

}
