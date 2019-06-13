//用户IP
var ip = "";
//用户所在城市
var city = "";
//实例化编辑器
//富文本编辑器
/*var um = null;
um = UM.getEditor('myEditor',{
    initialContent:"",
    autoHeightEnabled:false,
    toolbar:[
        /!*    'emotion'*!/
        ''
    ]
});*/
//显示客服
/*function showkf(){

    if($("#username").val()!=null && $("#username").val()!=""){
        $(".YYbgc").css("display","block");
        $("#chatContent").scrollTop(999999);
        var date = modifyTime();
        $("#msgtmp").find('[ff="msgdate"]').html(date);
        createSocket();
    }else{
        $("#verifications").css("display","block");
    }

}*/
var OS = '';
var OSArray = {};
var UserAgent = navigator.userAgent.toLowerCase();
OSArray.Windows = (navigator.platform == 'Win32') || (navigator.platform == 'Windows');
OSArray.Mac = (navigator.platform == 'Mac68K') || (navigator.platform == 'MacPPC')
    || (navigator.platform == 'Macintosh') || (navigator.platform == 'MacIntel');
OSArray.iphone = UserAgent.indexOf('iPhone') > -1;
OSArray.ipod = UserAgent.indexOf('iPod') > -1;
OSArray.ipad = UserAgent.indexOf('iPad') > -1;
OSArray.Android = UserAgent.indexOf('Android') > -1;
for (var i in OSArray) {
    if (OSArray[i]) {
        OS = i;
    }
}
/**
 *
 *
 * 客服的js
 *
 *
 */

//websocket链接
var socket = null;

//发送给谁
var toUser="";
//用户ID
var userid = "";

//登陆用户名
var username = document.getElementById("customerName").innerText;


//判断聊天用户名字
// var Nickname =  $("#customerName").val();

//用户头像路径
var txImage = "";

//手机号码
var phones= "";

//地址

var address = "";


//文件类型
var imgFilter = ".jpeg|.gif|.jpg|.png|.bmp|.pic|";
var videoFilter = ".mp4|";

if($.cookie('toUser')!=null){
    toUser = $.cookie('toUser');
}else{
    toUser = "";
}

var to="";
if($.cookie('to')!=null){
    to = $.cookie('to');
}else{
    to = "";
}

//var isp ="localhost:9001";
//测试
var isp ="192.168.1.188";
//正式
//var isp ="192.168.1.71";
//判断链接是否断开
var profile="";

var id = "201804190000001";

$.ajax({
    type:"POST",
    url: "/restTemplate",
    async:false,
    dataType:'json',
    success:function(msg){
        txImage  = msg.result.images;
        phones   = msg.result.phonenumber;
        Nickname = msg.result.Nickname;
        address  = msg.result.address;
        userid   = msg.result.FatherUserId;
    },
    //ajax异常时提醒用户
    error:function(msg){
    }

})



if(id!=null){
    $.ajax({
        type:"POST",
        url: "/servicecenter/getChatList",//你的请求程序页面随便啦
        async:false,//同步：意思是当有返回值以后才会进行后面的js程序。
        data:{"id":userid},
        dataType : 'jsonp',
        jsonp : 'callback',
        success:function(msg){
            if(msg.list!=null){
                for(var i=0; i<msg.list.length;i++){
                    //消息列表中显示自己的消息
                    addMessageone(msg.list[i]);
                }
                createSocket();
            }
        },
        //ajax异常时提醒用户
        error:function(msg){
        }

    })

}
//创建Socket连接
function createSocket(){
    $.ajax({
        type:"GET",
        url: "/address/getIpAndAddress",//你的请求程序页面随便啦
        async:false,//同步：意思是当有返回值以后才会进行后面的js程序。
        dataType : 'json',
        success:function(msg){
            ip = msg.ip;
            city = msg.city;
            phones = msg.phone;
        },
        //ajax异常时提醒用户
        error:function(msg){
        }

    })


}
//判断当前浏览器是否支持WebSocket
if('WebSocket' in window ){
    //创建Socket链接
    if(!socket){
        socket = new WebSocket("wss://www.ourproteinfactory.com/websocket");
        /*if( $("#FatherUserId").val()!=null){
          var obj = JSON.stringify({
              from: $("#FatherUserId").val(),
              fromUserInfo: {
                  information:city+"_"+OS,
                  userid:$("#FatherUserId").val(),
                  isCustomer: 0,
                  username: $("#unames").val(),
                  message:"登录",
                  phone:phones
              },
              profile: '链接恢复'
             });
          // 发送消息
          setTimeout(function(){socket.send(obj);},1000);
        }*/
    }
}else{
    alert('Dont support websocket')
}
//连接发生错误的回调方法
socket.onerror = function(){
};

//连接成功建立的回调方法
socket.onopen = function(){
    _LoginWS();
}

//关闭连接
socket.onclose= function(){
    console.log("链接关闭");
    logout();
}
//接收服务器的消息
socket.onmessage=function(ev){
    var data = JSON.parse(ev.data);
    if(toUser=="" || toUser==null && ($.cookie('toUser')==null || $.cookie('toUser')=="")){
        toUser = data.toUser;
        $.cookie('toUser',toUser);
    }
    if (to == "" || to==null) {
        if(data.fromUser.id!=data.id){
            to = data.fromUser.id;
            if($.cookie('to')==null){
                $.cookie('to',to);
            }
        }
    }
    if(id==null || id==""){
        id = data.from;
    }
    if(profile==null || profile==""){
        if(data.profile!=null){
            profile = data.profile;
            $.cookie('to',null);
            to = "";
        }

    }
    var obj = eval(   '('+ev.data+')'   );
    addMessageone(obj);
}
//发送消息
/*$("#sendsss").click(function(){
    send();
});*/


/*$(".closepng").click(function(){
	   socket.onclose=logout();
})*/

//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
window.onbeforeunload = function () {
    socket.close();
}


/**
 * 设置登录
 * @private
 */
function _LoginWS() {
    var message = {
        id: userid,
        fromUser: {
            userid: userid,
            username: username,
            path: txImage,
            isCustomer: 0
        },
        chatList: {
            id : userid,
            image : txImage,//用户头像
            name : username,
            phone :phones,//手机号
            address: city,//用户地址
            os : OS,
            source: 0//来源网站
        },
        profile: 7
    };
    var data = JSON.stringify(message);
    socket.send(data);
}
/**
 * 设置登录
 * @private
 */
function logout() {
    var message = {
        id: userid,
        fromUser: {
            userid: userid,
            username: username,
            path: txImage,
            isCustomer: 0
        },
        profile: 8
    };
    var data = JSON.stringify(message);
    socket.send(data);
}

//发送消息
function send() {
    var txt = $("#con").val();
    //json对象
    var message = {
        id: userid,
        fromUser: {
            id: '',
            userid: userid,
            username: username,
            path: txImage,//用户头像
            // time:modifyTime(),
            isCustomer: 0
        },
        chatList: {
            id : userid,
            image : txImage,//用户头像
            username : username,
            phone :phones,//手机号
            address: address,//用户地址
            os : OS,
            source: 0//来源网站
        },
        to: '',
        message: txt,//文本框内容
        profile: 0//正常消息
    };

    /* message : {
         content : content,
         from : username,
         to : "",      //接收人,如果没有则置空,如果有多个接收人则用,分隔
         // time : getDateFull()
     },
     type : "content"
 }));*/
    var obj = JSON.stringify(message);
    socket.send(obj);
}

/*function send(){
  /!*  var nickname = "";
    if($("#uname").val()!=null && $("#uname").val()!=""){
        //获取用户的用户名
        nickname=$("#uname").val();
    }else{
        //设置用户名为临时用户
        nickname="Anonymous User";
    }*!/
/!*    if (!um.hasContents()) {  // 判断消息输入框是否为空
        // 消息输入框获取焦点
        um.focus();
        // 添加抖动效果
        $('.edui-container').addClass('am-animation-shake');
        setTimeout("$('.edui-container').removeClass('am-animation-shake')", 1000);
    } else {*!/
        //获取输入框的内容
        var txt = $("#usernameT").val();
     /!*   var reg2 = new RegExp("<p><br></p>","g");//g,表示全部替换。
        var reg3 = new RegExp("<p><br/></p>","g");//g,表示全部替换。
        var reg5 = new RegExp("<br/>","g");//g,表示全部替换。
        var reg6 = new RegExp("<br>","g");//g,表示全部替换。
        var reg7 = new RegExp("<p></p>","g");//g,表示全部替换。*!/
       /!* txt = txt.replace(reg2,"");
        txt = txt.replace(reg3,"");
        txt = txt.replace(reg5,"");
        txt = txt.replace(reg6,"");
        txt = txt.replace(reg7,"");*!/
        //json对象
        var message = {
            id: userid,
            fromUser: {
                id: '',
                userid: userid,
                username: username,
                path: tx,//用户头像
                isCustomer: 0
            },
            chatList: {
                id : userid,
                image : tx,//用户头像
                name : username,
                phone :phones,//手机号
                address: city,//用户地址
                os : OS,
                source: 0//来源网站
            },
            to: '',
            message: txt,//文本框内容
            profile: 0//正常消息
        };
        //构建一个标准格式的JSON对象
        var obj = JSON.stringify(message);
        // 发送消息
        socket.send(obj);
        // 清空消息输入框
     /!*   um.setContent('');
        // 消息输入框获取焦点
        um.focus();*!/
    // }
}*/

function addMessageone(msg){

    if(msg.profile==0){
        var showContent = msg.message;

    }else if(profile==1){
        var showContent = '<img style="width: 200px" src="/chatFile' + msg.fileVO.path + '">';
    }else if(profile==2){
        var showContent = '<video style="width: 266px;height: 178px;" controls>'+
                        '<source src="/chatFile' + msg.fileVO.path + '" type="video/mp4">'+
                  '</video>';
    }else if(profile==3){
        console.log(msg.fileVO.fileName);
        console.log(msg.fileVO.path);
        var showContent =
        '<a download="' + msg.fileVO.fileName + '" href="/up/downloadChatFile?filePath=' + msg.fileVO.path + '">' +
            '<div class="Uyco">' +
                '<div class="Uykefu">'+
                    '<span style="position:relative;">'+
                        '<img class="Uyimg" alt="" src="/img/YYwenjian.png">'+
                        '<span class="Uyspan" title="' + msg.fileVO.fileName + '">'+msg.fileVO.fileName+'</span>'+
                        '<span class="Uysrc">'+msg.fileVO.size+'</span>'+
                    '</span>'+
                    '<a class="Uycoco" download="'+ msg.fileVO.fileName +' " href="/up/downloadChatFile?filePath=' + msg.fileVO.path + '">download</a>'+
                '</div>' +
            '</div>' +
         '</a>';
    }else{
        var showContent="";
    }

    var isSef = username == msg.fromUser.username ? "me" : "";   //如果是自己则显示在右边,他人信息显示在左边

    if(isSef=="me"){
        var r =
            ' <div class="kefu-time" >\n' +
            modifyTime() +
            ' </div>' +
            '<div class="content-right"><div class="avatar-r"><img src="/img/avatar2.png" alt=""></div><div class="message-r">' +
            showContent + '<span class="arrow-r"></span></div></div>'
        content.innerHTML += r;
        if (ipt.value == "") {
            $('.add-img').css('display', 'block')
            $('.sub-btn').css('display', 'none')
        }
        content.scrollTop = content.scrollHeight
        document.getElementById("con").value="";
    }else{
        var r =
            '<div class="kefu-time" >\n' +
            modifyTime() + '</div>' +
            '<div class="content-left"><div class="avatar-l"><img src="/img/avatar1.png" alt=""></div><div class="message-l">' +
            showContent + '<span class="arrow-l"></span></div></div>'
        content.innerHTML += r;
        if (ipt.value == "") {
            $('.add-img').css('display', 'block')
            $('.sub-btn').css('display', 'none')
        }
        content.scrollTop = content.scrollHeight
        document.getElementById("con").value="";
    }
}
//人名nickname，时间date，是否自己isSelf，内容content
/*function addMessageone(msg){
    var reg = new RegExp("<p>","g");//g,表示全部替换。
    var reg1 = new RegExp("</p>","g");//g,表示全部替换。
    var reg2 = new RegExp("<p><br></p>","g");//g,表示全部替换。
    var reg3 = new RegExp("<p><br/></p>","g");//g,表示全部替换。
    var reg5 = new RegExp("<br/>","g");//g,表示全部替换。
    var reg6 = new RegExp("<br>","g");//g,表示全部替换。
    var reg7 = new RegExp("<p></p>","g");//g,表示全部替换。
    if(msg.profile==0){

        var txt = msg.message.replace(reg2,"");

    }else if(msg.profile==1){
        var txt='<img style="width: 200px" src="/chatFile' + msg.fileVO.path + '">';
//		var txt='<img style="width: 200px" src="' + msg.fileVO.path + '">';
    }else if(msg.profile==2){
        var txt = '<video style="width: 266px;height: 178px;" controls>'+
            //		 '<source src="/chatFile' + data.path + '" type="video/mp4">'+
            '<source src="/chatFile' + msg.fileVO.path + '" type="video/mp4">'+
            '</video>';
    }else if(msg.profile==3){
        var txt= '<a download="'
            + msg.fileVO.fileName + '" href="http://www.ourproteinfactory.com/servicecenter/downloadChatFile?filePath=' + msg.fileVO.path + '"><div class="Uyco"><div class="Uykefu">'+
            '<span style="position:relative;">'+
            '<img class="Uyimg" alt="" src="/chatFile/YYwenjian.png">'+
            '<span class="Uyspan" title="' + msg.fileVO.fileName + '">'+msg.fileVO.fileName+'</span>'+
            '<span class="Uysrc">'+msg.fileVO.size+'</span>'+
            '</span>'+
            '<a class="Uycoco" download="'
            + msg.fileVO.fileName + '" href="http://www.ourproteinfactory.com/servicecenter/downloadChatFile?filePath=' + msg.fileVO.path + '">download</a>'+
            '</div></div></a>';
    }else{
        var txt ="";
    }
    txt = txt.replace(reg3,"");
    txt = txt.replace(reg5,"");
    txt = txt.replace(reg6,"");
    txt = txt.replace(reg7,"");

    var box = $("#msgtmp").clone(); 	//复制一份模板，取名为box
    box.show();	//设置box状态为显示
    box.appendTo("#chatContent");		//把box追加到聊天面板中
    if(txt.indexOf("Uyspan")!=-1){
        box.find('.YYbor').css('color','black');
        box.find('.YYbor').css('color','black');
    }else{
        box.find('.YYbor').css('color',(msg.fromUser.isCustomer==0?'white':'black'));
        box.find('.YYco').css('width','100%');
        box.find('.YYbor').css('background',(msg.fromUser.isCustomer==0?'black':'white'));
    }
    box.find('[ff="nickname"]').html(msg.fromUser.isCustomer==0?msg.fromUser.username:'Alanine'); //在box中设置昵称
    box.find('.YYco').css('float',msg.fromUser.isCustomer==0?'right':'left'); //在box中设置昵称
    box.find('[ff="msgdate"]').html(msg.time); 		//在box中设置时间
    box.find('[ff="content"]').html(txt); 	//在box中设置内容
    box.find('.YYfloat').css('float',(msg.fromUser.isCustomer==0?'right':'left'));
    box.find('.YYco .YYbor').css('float',(msg.fromUser.isCustomer==0?'right':'left'));
    /!*box.find('.YYbor p').css('text-align',(msg.fromUserInfo.isCustomer==0?'right':'left'));
    box.find('.YYbor p').css('text-align',(msg.fromUserInfo.isCustomer==0?'right':'left'));*!/
    /!* box.addClass(msg.isSelf? 'am-comment-warning':'am-comment-success'); *!///颜色
    /!* box.addClass(msg.user? 'nodis':''); *!///右侧显示
    box.css('float',(msg.fromUser.isCustomer==0?'right':'left'));	//右侧显示
    /!* box.css((msg.isSelf? 'margin-left':'margin-right'),"20%"); *!///外边距
    $("#chatContent").scrollTop(999999); 	//滚动条移动至最底部
}*/
/*$(".closepng").click(function(){
    $(".YYbgc").css("display","none");
})*/

//更改时间格式
function modifyTime(){
    var now = new Date;
    var y = now.getFullYear();
    var m = now.getMonth();
    var d = now.getDate();
    var h = now.getHours();
    var mm = now.getMinutes();
    var s = now.getSeconds();
    var str;
    if(h>12) {
        h -= 12;
        str = " PM";
    }else{
        str = " AM";
    }
    h = h < 10 ? "0" + h : h;
    d = d < 10 ? "0" + d : d;
    m = m < 10 ? "0" + m : m;
    mm = mm < 10 ? "0" + mm : mm;
    s = s < 10 ? "0" + s : s;
    var xy = h + ":" + mm;
    xy += str;
    return xy;
}
//上传文件
function uploadChatFile() {
    var formData = new FormData();
    var files = document.getElementById("file_input").files[0];
    formData.append("file", files);
    $.ajax({
        url: '/up/uploadFiles',
        data: formData,
        type: 'POST',
        async:false,//同步：意思是当有返回值以后才会进行后面的js程序。
        dataType : 'json',
        contentType: false,
        processData: false,
        success: function (data) {
            var suffix = data.fileName.substr(data.fileName.lastIndexOf(".") + 1, data.fileName.length);
            var name = data.path.substr(data.path.indexOf("_") + 1, data.path.length);
            suffix = suffix.toLocaleLowerCase();
            var val = '';
            var profile = '';
            if (imgFilter.indexOf(suffix) > -1) {
                /*val += '<img style="width: 200px" src="/chatFile' + data.path + '">';*/
                profile = 1;
            } else if (videoFilter.indexOf(suffix) != -1) {
                /*val += '<video style="width: 266px;height: 178px;" controls>';
                val += '<source src="/chatFile' + data.path + '" type="video/mp4">';
                val += '</video>';*/
                profile = 2;
            } else {
                /*val += '<a download="'
                    + name + '" href="http://192.168.1.188:9002/servicecenter/downloadChatFile?filePath=' + data.path + '"><div class="Uyco"><div class="Uykefu">'+
                         '<span style="position:relative;">'+
                             '<img class="Uyimg" alt="" src="/chatFile/YYwenjian.png">'+
                             '<span class="Uyspan" title="' + data.name + '">'+data.name+'</span>'+
                             '<span class="Uysrc">'+data.size+'</span>'+
                         '</span>'+
                         '<a class="Uycoco" download="'
                         + name + '" href="http://192.168.1.188:9002/servicecenter/downloadChatFile?filePath=' + data.path + '">download</a>'+
                     '</div></div></a>';*/
                profile = 3;

            }
            var message = {
                id: userid,
                fromUser: {
                    id:'',
                    username: username,
                    userid: userid,
                    isCustomer: 0,
                    path: txImage
                },
                chatList: {
                    id : userid,
                    image : txImage,//用户头像
                    name : username,
                    phone :phones,//手机号
                    address: address,//用户地址
                    os : OS,
                    source: 0//来源网站
                },
                to: '',
                fileVO:{
                    fileName:data.fileName,
                    path:data.path,
                    size:data.size,
                    suffix:suffix
                },
                profile:profile
            };
            var res = JSON.stringify(message);
            socket.send(res);
            document.getElementById("file_input").value = "";
        }
    });
}


//视频通讯

var pc;
var mainsss; // 视频的DIV
var maint; // 视频的DIV
var errorNotice; // 错误提示DIV
var WebSockets; // websocket
var localVideo; // 本地视频
var miniVideo; // 本地小窗口
var remoteVideo; // 远程视频
var localStream; // 本地视频流
var remoteStream; // 远程视频流
var localVideoUrl; // 本地视频地址
// var initiator = $("#initiator").val(); // 是否已经有人在等待
var mediaStreamTrack;
var started = false; // 是否开始
var channelReady = false; // 是否打开websocket通道

var channelOpenTime;
var channelCloseTime;

var PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;

var mediaConstraints = {
    "has_audio" : true,
    "has_video" : true
}; // 音频和视频
// 初始化
function initialize() {
    console.log("初始化");

    mainsss = document.getElementById("mains");
    maint = document.getElementById("maint");
    errorNotice = document.getElementById("errorNotice");
    localVideo = document.getElementById("localVideo");
    miniVideo = document.getElementById("miniVideo");
    remoteVideo = document.getElementById("remoteVideo");

    noticeMsg();
    openChannel();
    getUserMedia();
}

// 获取用户的媒体
/*function getUserMedia() {
    console.log("获取用户媒体");
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
    }).then(function(stream){
        localVideo.style.display = "inline-block";
        remoteVideo.style.display = "none";
        localVideo.srcObject = stream;
        localVideo.src = stream;
        mediaStreamTrack = stream;
        console.log("成功获取视频流");
        var obj = JSON.stringify({
            from: $("#FatherUserId").val(),
            message:"https://www.ourproteinfactory.com/msg?oid="+$('#oid').val(),
            fromUserInfo: {
                information:city+"_"+OS,
                userid:$("#FatherUserId").val(),
                isCustomer: 0,
                username: $("#unames").val(),
                phone:phones
            },
            profile: '视频通讯'
        });
        socket.send(obj);
        if (initiator){
            if (!started && localVideo.srcObject && channelReady) {
                setNotice("连接中...");
                createPeerConnection();
                pc.addStream(localVideo.srcObject);
                started = true;
                if (initiator)
                    doCall();
            }
        }
    }).catch(function(err) {
        console.log(err.name + ": " + err.message);
    });
}*/



// 开始连接
function maybeStart() {
    if (!started && localVideo.srcObject && channelReady) {
        setNotice("连接中...");
        createPeerConnection();
        pc.addStream(localVideo.srcObject);
        started = true;
        if (initiator)
            doCall();
    }
}
// 开始通话
function doCall() {
    console.log("开始呼叫");
    /* pc.createOffer(setLocalAndSendMessage, null); */
    /* pc.createOffer(function(sessionDescription) {
        pc.setLocalDescription(new RTCSessionDescription(sessionDescription), function() {
          // send the offer to a server to be forwarded to the friend you're calling.
        }, error);
      }, error); */
    pc.createOffer().then(localDescCreated).catch(onError);
    //sendMessage(desc);
}
function localDescCreated(desc) {
    pc.setLocalDescription(
        desc,
        () => sendMessage(desc),
        onError
    );
}
function onError(error) {
    console.error(error);
};
/* function setLocalAndSendMessage(sessionDescription) {
	pc.setLocalDescription(sessionDescription);
	sendMessage(sessionDescription);
} */

// 发送信息
function sendMessage(message) {
    var msgJson = JSON.stringify(message);

    WebSockets.send(msgJson);

    console.log("发送信息 : " + msgJson);
}

// 打开websocket
function openChannel() {
    console.log("打开websocket");
    WebSockets = new WebSocket("wss://www.ourproteinfactory.com/acgist.video/"+$("#oid").val());

    WebSockets.onopen = onChannelOpened;
    WebSockets.onmessage = onChannelMessage;
    WebSockets.onclose = onChannelClosed;
    WebSockets.onerror = onChannelError();
}

// 设置状态
function noticeMsg() {
    if (!initiator) {
        setNotice("让别人加入（注意事项查看源码）: https://www.ourproteinfactory.com/msg?oid="+$("#oid").val());
    } else {
        setNotice("初始化...");
    }
}

// 打开连接
function createPeerConnection() {
    var server = {"iceServers" : [{"url" : "stun:stun.l.google.com:19302"}]};
    pc = new PeerConnection(server);
    pc.onicecandidate = onIceCandidate;
    pc.onconnecting = onSessionConnecting;
    pc.onopen = onSessionOpened;
    pc.onaddstream = onRemoteStreamAdded;
    pc.onremovestream = onRemoteStreamRemoved;
}

// 谁知状态
function setNotice(msg) {
    /* document.getElementById("foote").innerHTML = msg; */
}

// 响应
function doAnswer() {
    pc.createAnswer().then(localDescCreated).catch(onError);
}

// websocket打开
function onChannelOpened() {
    console.log("websocket打开");

    channelOpenTime = new Date();
    channelReady = true;
    if (initiator)
        maybeStart();
}

// websocket收到消息
function onChannelMessage(message) {
    console.log("收到信息 : " + message.data);

    processSignalingMessage(message.data);//建立视频连接
}

// 处理消息
function processSignalingMessage(message) {
    var msg = JSON.parse(message);

    if (msg.type === "offer") {
        if (!initiator && !started)
            maybeStart();
        pc.setRemoteDescription(new RTCSessionDescription(msg));
        doAnswer();
    } else if (msg.type === "answer" && started) {
        pc.setRemoteDescription(new RTCSessionDescription(msg));
    } else if (msg.type === "candidate" && started) {
        var candidate = new RTCIceCandidate({
            sdpMLineIndex : msg.label,
            candidate : msg.candidate
        });
        pc.addIceCandidate(candidate);
    } else if (msg.type === "bye" && started) {
        onRemoteClose();
    } else if(msg.type === "nowaiting") {
        onRemoteClose();
        setNotice("对方已离开！");
    }
}

// websocket异常
function onChannelError(event) {
    console.log("websocket异常 ： " + event);

    //alert("websocket异常");
}

// websocket关闭
function onChannelClosed() {
    console.log("websocket关闭");

    if(!channelOpenTime){
        channelOpenTime = new Date();
    }
    channelCloseTime = new Date();
    openChannel();
}

// 获取用户流失败
function onUserMediaError(error) {
    console.log("获取用户流失败！");
}

// 邀请聊天：这个不是很清楚，应该是对方进入聊天室响应函数
function onIceCandidate(event) {
    if (event.candidate) {
        sendMessage({
            type : "candidate",
            label : event.candidate.sdpMLineIndex,
            id : event.candidate.sdpMid,
            candidate : event.candidate.candidate
        });
    } else {
        console.log("End of candidates.");
    }
}

// 开始连接
function onSessionConnecting(message) {
    console.log("开始连接");
}

// 连接打开
function onSessionOpened(message) {
    console.log("连接打开");
}

// 远程视频添加
function onRemoteStreamAdded(event) {
    console.log("远程视频添加");
    localVideo.style.display = "inline-block";
    remoteVideo.style.display = "inline-block";
    miniVideo.srcObject = localVideo.srcObject;
    remoteVideo.srcObject = event.stream;
    remoteStream = event.stream;
    waitForRemoteVideo();
}

// 远程视频移除
function onRemoteStreamRemoved(event) {
    console.log("远程视频移除");
}

// 远程视频关闭
function onRemoteClose() {
    started = false;
    initiator = false;

    miniVideo.style.display = "none";
    remoteVideo.style.display = "none";
    localVideo.style.display = "inline-block";

    maint.style.webkitTransform = "rotateX(360deg)";

    miniVideo.src = "";
    remoteVideo.src = "";
    localVideo.src = localVideoUrl;

    setNotice("对方已断开！");

    pc.close();
}

// 等待远程视频
function waitForRemoteVideo() {
    if (remoteVideo.currentTime > 0) { // 判断远程视频长度
        transitionToActive();
    } else {
        setTimeout(waitForRemoteVideo, 100);
    }
}

// 接通远程视频
function transitionToActive() {
    remoteVideo.style.display = "inline-block";
    localVideo.style.display = "none";
    maint.style.webkitTransform = "rotateX(360deg)";
    setTimeout(function() {
        localVideo.src = "";
    }, 500);
    setTimeout(function() {
        miniVideo.style.display = "inline-block";
        //miniVideo.style.display = "none";
    }, 1000);

    setNotice("连接成功！");

}

// 全屏
function fullScreen() {
    maint.webkitRequestFullScreen();
}

// 关闭窗口退出
window.onbeforeunload = function() {
    sendMessage({type : "bye"});
    pc.close();
    WebSockets.close();
}

// 设置浏览器支持提示信息
function errorNotice(msg) {
    maint.style.display = "none";
    mainsss.style.display = "none";
    errorNotice.style.display = "block";
    errorNotice.innerHTML = msg;
}
//处罚点击视频通讯的按钮
function sptxsss(){
    if(!WebSocket) {
        errorNotice("你的浏览器不支持WebSocket！建议使用<a href=\"https://www.google.com/intl/zh-CN/chrome/browser/\" target=\"_blank\">google chrome浏览器！</a>");
    } else if(!PeerConnection) {
        errorNotice("你的浏览器不支持RTCPeerConnection！建议使用<a href=\"https://www.google.com/intl/zh-CN/chrome/browser/\" target=\"_blank\">google chrome浏览器！</a>");
    } else {
        if(window.navigator.userAgent.indexOf("Chrome") !== -1)
            setTimeout(initialize, 1); // 加载完成调用初始化方法
    }
}