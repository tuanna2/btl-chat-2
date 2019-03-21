const socket = io();
setCaretToPos(document.getElementById("msg-value"), 4);

$(document).ready(()=>{
    var onChat = false;
    var u = '';
    socket.on('session',name=>{
        $('#name').html(name);
    })
    socket.on('refresh-ol',list=>{
        $('.sideBar-body').remove();
        let online = list
        .map(e => e['name'])
        .map((e, i, final) => final.indexOf(e) === i && i)
        .filter(e => list[e]).map(e => list[e]); //loc cac name trung nhau

        $('#count-ol').html('Online: '+ online.length);
        online.forEach(e => {
            $('.sideBar').append('<div id="'+e.name+'" class="row sideBar-body"> <div class="col-sm-3 col-xs-3 sideBar-avatar"> <div class="avatar-icon"> <img src="/avatar/avatar6.png"> </div> </div> <div class="col-sm-9 col-xs-9 sideBar-main"> <div class="row"> <div class="col-sm-8 col-xs-8 sideBar-name"> <span class="name-meta">'+e.name+' </span> </div> <div class="col-sm-4 col-xs-4 pull-right"> <span class="time-meta pull-right online">•</span> </div> </div> </div> </div>')            
        });
        $('#'+u).css('background-color','rgba(96, 125, 139, 0.3)');
    })
    $('.sideBar').on('click','.sideBar-body',name=>{
        let click = $(name.currentTarget).attr('id');
        if(u == click) {
            setCaretToPos(document.getElementById("msg-value"), 4);
            return false;
        }
        if(onChat){
            let r = confirm('Thay đổi người chat sẽ mất tin nhắn và ngắt kết nối chat với người dùng hiện tại. Bạn có muốn tiếp tục ?')
            if(r){
                startChat(click,u);
                u = click;
            }
            return false;
        }
        startChat(click,'dungCoHoiLaGi');
        u = click;
        onChat = true;
    });
    function startChat(n,o){
        $('#name').html() != n ? socket.emit('inviting',n) : '';
        $('#'+o).css('background-color','#fff');
        $('#'+n).css('background-color','rgba(96, 125, 139, 0.3)');
        $('#name-fr').html(n);
        clearMsg();
        $('#avt-fr').attr('src','/avatar/avatar6.png');
        setCaretToPos(document.getElementById("msg-value"), 4);
    }
    function clearMsg(){
        $('.message-body').remove();
    }
    $('#trash').click(()=>{
        confirm('Xoá hết tin nhắn hiện tại? ') ? clearMsg() : '';
    })
    $('#msg-value').keypress(e => {
        if (e.which == '13') {
            sendMsg();
            return false;
        }
    });
    $('#send-msg').click(()=>{
        sendMsg();
    });
    function sendMsg(){
        socket.emit('send-msg',{to:u,msg:$('#msg-value').val()})
        let time = (new Date()).toLocaleTimeString()
        $('#conversation').append('<div class="row message-body"> <div class="col-sm-12 message-main-sender"> <div class="sender"> <div class="message-text"> '+$('#msg-value').val()+' </div> <span class="message-time pull-right">'+time+'</span> </div> </div> </div>')
        $('#msg-value').val('');
    }
    socket.on('send-msg',data=>{
        let time = (new Date()).toLocaleTimeString();
        data.from === u ?
        $('#conversation').append('<div class="row message-body"> <div class="col-sm-12 message-main-receiver"> <div class="receiver"> <div class="message-text">'+data.msg+'</div> <span class="message-time pull-right">'+time+'</span> </div> </div> </div>')
        : '';
    });
        var modalConfirm = (callback)=> {
            socket.on('inviting',name=>{
                if(name == u){
                    return false;
                }
                $('#myModalLabel').html(name+ ' mời bạn chat cùng!');
                $("#mi-modal").modal('show');
                $('#temporary').val(name);
            })
        $("#modal-btn-si").on("click", function(){
          callback(true);
          $("#mi-modal").modal('hide');
        });
        $("#modal-btn-no").on("click", function(){
          callback(false);
          $("#mi-modal").modal('hide');
        });
      };
      modalConfirm((confirm)=>{
        if(confirm){
            startChat($('#temporary').val(),u);
            u = $('#temporary').val();
            onChat = true;
        }
    })
})
function setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
      input.focus();
      input.setSelectionRange(selectionStart, selectionEnd);
    }
    else if (input.createTextRange) {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', selectionEnd);
      range.moveStart('character', selectionStart);
      range.select();
    }
  }
  
  function setCaretToPos (input, pos) {
    setSelectionRange(input, pos, pos);
  }