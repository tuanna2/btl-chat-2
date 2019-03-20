module.exports = function(io){
    var online=[];
    io.on('connection',socket=>{
        const userName = socket.request.session.user;
        socket.emit('session',userName);
        online.push({id: socket.id, name:userName});
        io.emit('refresh-ol',online);
        socket.on('disconnect',()=>{
            online.splice(online.findIndex(v=>v.id == socket.id),1);
            io.emit('refresh-ol',online);
        });
        socket.on('send-msg',data=>{
            let sockets = online.filter(e=> {return e.name == data.to});
            sockets.forEach(e => {
                io.to(e.id).emit('send-msg',{from:userName,msg:data.msg});
            })
        });
        socket.on('inviting',n=>{
            let sockets = online.filter(e=> {return e.name == n});
            sockets.forEach(e =>{
                io.to(e.id).emit('inviting',userName);
            })
        })
    })
}