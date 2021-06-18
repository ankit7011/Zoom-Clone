const { Socket } = require('dgram');
const express=require ('express');
const app=express();
const server = require('http').Server(app);
const io= require('socket.io')(server);
const {v4:uuidv4 }= require('uuid') //importing or instaliin particular version of uuid i.e 4
const { ExpressPeerServer } =require('peer');
const peerServer = ExpressPeerServer(server,{
    debug : true
});

app.set('view engine','ejs');
app.use(express.static('public'));
app.use('/peerjs',peerServer);

app.get('/',(req,res) => { //es6 function

    res.redirect(`/${uuidv4()}`); //res->response,,here a unique room id is generating and getting redirected to it
    //basically uuidv4 gives new unique id for a room which can be seen in url
} )

app.get('/:room',(req,res)=>{
    res.render('room',{roomId: req.params.room})
})

io.on('connection',socket=>{
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId);
        //console.log(userId);
        socket.broadcast.to(roomId).emit('user-connected',userId);
        //console.log("in io connnnection");
        socket.on('message',message =>{
            io.to(roomId).emit('createMessage',message)
        })

        socket.on('disconnect',()=>{
            console.log("HERE I M IN DISCONNET")
            socket.broadcast.to(roomId).emit('user-disconnected',userId)
        })
    })  
})

server.listen(3030);  //this measn server is going to be a local host and port is going to be 3030
 