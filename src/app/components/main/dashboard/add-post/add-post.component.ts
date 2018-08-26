import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../../../services/websocket.service';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { MessageService } from 'primeng/components/common/messageservice';
import { PostsService } from '../../../../services/posts.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  constructor(private webSocketService: WebsocketService, private messageService: MessageService, private postService: PostsService) { }
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  post:String
  me = JSON.parse(localStorage.getItem('user'))

  picture:any
  tempPicture:any
  imageSelected:Boolean = false
  imgPost:String




  playSound()
  {
    let audio = new Audio();
    audio.src = "../assets/sounds/seen.mp3";
    audio.loop = false
    audio.load();
    audio.play();
  }


  wrongFileFormat()
  { 
    this.messageService.add({severity:'warn', summary:'Wrong file type', detail:'please use jpg, jpeg or png'});

  }

///////////////////////change Wall Picture/////////////////////////////


onPictureSelected(event)
{
  this.picture = <File>event.target.files[0]
  if (event.target.files && event.target.files[0]) 
  {
     var reader = new FileReader();
     reader.onload = (event:any) => 
     {   

         this.imageSelected = true
        // this.picture = event.target.result
         this.tempPicture = event.target.result;
     }
     reader.readAsDataURL(event.target.files[0]);
 }  
}



uploadPicture()
{


  let currentdate = new Date(); 
  let datetime = 
  {
     month: this.months[(currentdate.getMonth()+1)] ,
     date: currentdate.getDate() ,            
     year: currentdate.getFullYear() ,  
     hour: currentdate.getHours() ,  
     minute: currentdate.getMinutes()
  }



  let postInfo =
  {  
     from:this.me.id,
     to: '',
     post:this.imgPost,
     time: datetime,
  }


   const fd = new FormData


      fd.append("Pic", this.picture, this.picture.name)
      fd.append("from", JSON.stringify(postInfo))
      this.imageSelected = false;




   let post = JSON.stringify(postInfo)


   this.postService.uploadPostWithImage(fd)
   .subscribe(res =>{
    this.webSocketService.postWithPhoto(res)
  })
}


cancelPictureChange()
{     
    this.imageSelected = false
    this.picture = null
}

    
      
///////////////////////////////////////////////////////////////////////











  addpost()
  {   

    let currentdate = new Date(); 
    let datetime = 
    {
       month: this.months[(currentdate.getMonth()+1)] ,
       date: currentdate.getDate() ,            
       year: currentdate.getFullYear() ,  
       hour: currentdate.getHours() ,  
       minute: currentdate.getMinutes()
    }

    let postInfo =
    {
      from:this.me.id,
      to: '',
      post:this.post,
      image: '',
      time: datetime
    }
    this.playSound()
    this.webSocketService.addPost(postInfo)
    this.post = ""
  }


  ngOnInit() {
  }

}
