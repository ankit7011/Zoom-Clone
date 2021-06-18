const socket=io('/');
const videoGrid=document.getElementById('video-grid');  
console.log(videoGrid);
const myVideo=document.createElement('video');
myVideo.muted=true;
const peers={}

const peer = new Peer(undefined,{
    path : '/peerjs',
    host : '/',
    port : '443'
}); 

let myVideoStream;

navigator.mediaDevices.getUserMedia({ // this gets the audio and video allowance for browser for user
    //getusermedia accepts an object
    video : true,
    audio :true
}).then(stream=>{
    myVideoStream=stream;
    addVideoStream(myVideo,stream);
    console.log(myVideo)

    peer.on('call',call=>{
        call.answer(stream);
        const video=document.createElement('video')
        call.on('stream',userVideoStream=>{
            addVideoStream(video,userVideoStream)
            console.log("debug in answer");
        })
    })
    //console.log("debug in then ");

    socket.on('user-connected',userId=>{
        console.log("User Connected", userId);
        connectToNewUser(userId, stream);
        setTimeout(connectToNewUser,1000,userId,stream)
    })

    socket.on('user-disconnected',userId=>{
        console.log("user dis : " + userId)
        if(peers[userId]) peers[userId].close()
    })
    
})

peer.on('open',id=>{
    console.log("debug in peer on " + id    );

    socket.emit('join-room',ROOM_ID,id);
})


const connectToNewUser=(userId,stream)=>
{
    const call=peer.call(userId,stream);
    const video =document.createElement('video') ;//creating new video element for connecting user
    console.log("debug in connect new user");
    //console.log(call);
    console.log(stream);
    console.log(userId);
    /* call.on('active',()=>{
        console.log("Heyy");
    }) */
    call.on('stream',userVideoStream => {
  //      console.log("call on ");
        addVideoStream(video,userVideoStream)
//        console.log("debug12");
    })
    peers[userId]=call

    
}



const addVideoStream=(video,stream)=> {
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    console.log(video)
    videoGrid.append(video);
}

let text = $('input')  //$  ->  JQuery

$('html').keydown((e)=>{
    console.log("HERE MSG")
    if(e.which==13 && text.val().length!==0)  // here 13 means enter key i.e. every key has its own value and for enter it is 13 ...also checking for empty msg
    {
        console.log(text.val())
        socket.emit('message',text.val()); 
        text.val('')   // emptythe text area after  sending msg
    }
})


socket.on('createMessage',message =>{
    //console.log("This Message coming from server ", message)
    $('ul').append(`<li class="message"> <b>user</b><br/>${message}</li> `)
    scrollToBottom()
})

const scrollToBottom = () =>{
    let d=$('.main_chat_window');
    d.scrollTop(d.prop('scrollHeight'));
}


const muteButtonFunct = () =>{
    const enable = myVideoStream.getAudioTracks()[0].enabled;
    //console.log(enable)
    if(enable)
    {
        myVideoStream.getAudioTracks()[0].enabled=false;
        setUnmuteButton();
    }
    else
    {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled=true;
    }
}

const setMuteButton =()=>{
    const html =`
    <i class = "mute fas fa-microphone"></i>
    <span>Mute</span>
    `
    document.querySelector('.main_mute_button').innerHTML=html
}

const setUnmuteButton =()=>{
    const html =`
    <i class = "unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `
    document.querySelector('.main_mute_button').innerHTML=html
}

const playStopButton = () =>{
    let enabled=myVideoStream.getVideoTracks()[0].enabled
    if(enabled)
    {
        setPlayVideo()
        myVideoStream.getVideoTracks()[0].enabled=false;
    }
    else
    {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled=true
    }
}

const setPlayVideo =()=>{
    const html=`
    <i class ="showVideo fas fa-video-slash"></i>
    <span>Show Video</span>
    `
    document.querySelector(".main_video_button").innerHTML=html
}


const setStopVideo =()=>{
    const html=`
    <i class ="fas fa-video"></i>
    <span>Stop Video</span>
    `
    document.querySelector(".main_video_button").innerHTML=html
}
