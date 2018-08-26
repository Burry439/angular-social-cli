import { Component, OnInit, HostListener } from '@angular/core';
import {MessageService} from 'primeng/components/common/messageservice';
import { AuthService } from '../../../services/auth.service';
import { PostsService } from '../../../services/posts.service';
import { WebsocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile:any
  posts:any[] = []
  me = JSON.parse(localStorage.getItem('user'))


  ///profile pic varibles
  profilePicture:any
  tempProfilePicture:any
  profileImageSelected:boolean
  ////////////////////

  //////wall pic vars 

  wallPicture:any
  tempwallPicture:any
  wallImageSelected:boolean

  ///////////////

  ///diolog vars////
  display: boolean = false;
  dialogImage:String = '' ;
  dialogImageSize:Number = 500
  innerWidth:Number;
/////////////////////

  constructor(private messageService: MessageService, private authService:AuthService, private postService:PostsService, private webSocketService: WebsocketService) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
  this.innerWidth = window.innerWidth;


      if(this.innerWidth < 478)
      {
        this.dialogImageSize = 300
      }
  }



   on() {
    document.getElementById("overlay").style.display = "block";
}

 off() 
 {
    document.getElementById("overlay").style.display = "none";
}



  showDialog(image) {
    this.dialogImage = image
    this.display = true;
}



  wrongFileFormat()
  { 
    this.messageService.add({severity:'warn', summary:'Wrong file type', detail:'please use jpg, jpeg or png'});

  }



  playSound()
{
  let audio = new Audio();
  audio.src = "../assets/sounds/notification.mp3";
  audio.loop = false
  audio.load();
  audio.play();
}


///////////////////////change Wall Picture/////////////////////////////


onWallPictureSelected(event)
{
  this.wallPicture = <File>event.target.files[0]
  if (event.target.files && event.target.files[0]) 
  {
     var reader = new FileReader();
     reader.onload = (event:any) => 
     {   
        this.tempwallPicture = this.profile.wallPic
        this.profile.wallPic = event.target.result;
        this.wallImageSelected = true
     }
     reader.readAsDataURL(event.target.files[0]);
 }  
}



uploadWallPicture()
{
   const fd = new FormData()
   fd.append("wallPic", this.wallPicture, this.wallPicture.name)
   this.wallImageSelected = false;

   this.authService.updateWallPic(fd)
   .subscribe(res =>{
       if(res == "wrong")
       { 
           this.profile.wallPic = this.tempwallPicture
          this.wrongFileFormat()
           return null
       }

     this.profile.wallPic = res.wallPic
     this.webSocketService.changedWallPic(res.wallPic, this.me.id, this.me.firstname, this.me.lastname)

 },)
}


cancelWallPictureChange()
{  
  this.profile.wallPic = this.tempwallPicture
  this.wallImageSelected = false
}

///////////////////////////////////////////////////////

/////////////// change profile Picture//////////////////

  onProfilePictureSelected(event)
  {  
       this.profilePicture = <File>event.target.files[0]
       if (event.target.files && event.target.files[0]) 
       {
          var reader = new FileReader();
          reader.onload = (event:any) => 
          {   
             this.tempProfilePicture = this.profile.profilePic
             this.profile.profilePic = event.target.result;
             this.profileImageSelected = true
          }
          reader.readAsDataURL(event.target.files[0]);
      }  
  }


  uploadProfilePicture()
  {
     const fd = new FormData()
     fd.append("profilePic", this.profilePicture, this.profilePicture.name)
     this.profileImageSelected = false;
     this.authService.updateProfilePic(fd)
     .subscribe(res =>{
         
         if(res == "wrong")
         { 
             this.profile.profilePic = this.tempProfilePicture
            this.wrongFileFormat()
             return null
         }
 
       this.profile.profilePic = res.profilePic
        this.webSocketService.changedProfilePic(res.profilePic, this.me.id, this.me.firstname, this.me.lastname)
   },)
  }
 
  cancelProfilePictureChange()
  {  
    this.profile.profilePic = this.tempProfilePicture
    this.profileImageSelected = false
  }

  deletePost(id)
  {   
      this.webSocketService.deletePost(id)
  }


  editPost(edit, id)
    {   

        let postInfo =
        {
          post:edit,
          _id:id
        }

       this.webSocketService.editPost(postInfo)
    }

////////////////////////////////////////////////////

  ngOnInit() {

    this.innerWidth = window.innerWidth;


    this.authService.getProfile().subscribe((profile:any) => {
      this.profile = profile
      this.postService.getMyPosts(profile._id).subscribe((posts)=>{
        this.posts = posts
      })
    })


  this.webSocketService.socket.on('new-post', (post)=>{

     if(post.from._id == this.me.id || post.to._id == this.profile._id)
     {
      this.posts.unshift(post)
     }
     
  })


  this.webSocketService.socket.on('deleted-post', (post)=>{
      
    for(let i = 0; i < this.posts.length; i++)
    {
      if(this.posts[i]._id == post._id)
      {
        this.posts.splice(i,1)
      }
    }

})


this.webSocketService.socket.on('edited-post', (post)=>{
      
  for(let i = 0; i < this.posts.length; i++)
  {
    if(this.posts[i]._id == post._id)
    {
      this.posts[i].post = post.post
    }
  }
})


this.webSocketService.socket.on('new-profilePic', (profilePic)=>{
    
  for(let i = 0; i < this.posts.length; i++)
  {
      this.posts[i].from.profilePic = profilePic
  }
})


  }

}
