function isEmpty() {
    //监听输入框的变化，改变按钮状态
    $(document).on('input propertychange', '.ipt', function (e) {
        if (e.type === 'input' || e.originalEvent.propertyName === "value") {
            if (this.value.length >= 1) {
                $('.add-img').css('display', 'none')
                $('.sub-btn').css('display', 'block')
            } else {
                $('.add-img').css('display', 'block')
                $('.sub-btn').css('display', 'none')
            }
        }
    })
}
isEmpty()

var content = document.getElementsByClassName('kefu-body')[0];
var btn = document.getElementsByClassName('sub-btn')[0]
var ipt = document.getElementsByClassName('ipt')[0];
content.scrollTop = content.scrollHeight

// 获取时间显示在页面上
function getContent(cons) {
    Date.prototype.format = function (fmt) {
        const o = {
            "y+": this.getFullYear(),
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "H+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            // "S+": this.getMilliseconds(),
            "q+": Math.floor(this.getMonth() / 3) + 1,
            "h+": (() => {
                const hour = this.getHours() % 12;
                return hour == 0 ? 12 : hour;
            })(),
            "E+": (() => {
                const week = {
                    "0": "Sunday",
                    "1": "Monday",
                    "2": "Tuesday",
                    "3": "Wednesday",
                    "4": "Thursday",
                    "5": "Friday",
                    "6": "Saturday"
                };
                return week[this.getDay() + ""];
            })(),
            /*
            "e+": (()=>{
                const week = {"0":"Sun","1":"Mon","2":"Tue","3":"Wed","4":"Thu","5":"Fri","6":"Sat"}; 
                return week[this.getDay()+""];
            })(),
            */
            "x1": (() => {
                const week = {
                    "0": "周日",
                    "1": "周一",
                    "2": "周二",
                    "3": "周三",
                    "4": "周四",
                    "5": "周五",
                    "6": "周六"
                };
                return week[this.getDay() + ""];
            })(),
            "x2": (() => {
                const hour = ["凌晨", "早上", "下午", "晚上"];
                const h = this.getHours();
                if (h == 12) return "中午";
                return hour[parseInt(h / 6)];
            })(),
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")", "g").test(fmt)) {
                const len = RegExp.$1.length;
                fmt = fmt.replace(RegExp.$1, len == 1 ? o[k] : ("00" + o[k]).substr(-len));
            }
        }
        return fmt;
    }
    Date.prototype.toWeiXinString = function () {
        let str;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        const beforeYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2);
        const monday = new Date(today);
        monday.setDate(today.getDate() - (today.getDay() ? today.getDay() - 1 : 6));
        if (this.getTime() > today.getTime()) {
            str = "";
        } else if (this.getTime() > yesterday.getTime()) {
            str = "昨天";
        } else if (this.getTime() > beforeYesterday.getTime()) {
            str = "前天";
        } else if (this.getTime() > monday.getTime()) {
            const week = {
                "0": "周日",
                "1": "周一",
                "2": "周二",
                "3": "周三",
                "4": "周四",
                "5": "周五",
                "6": "周六"
            };
            str = week[this.getDay() + ""];
        } else {
            const hour = ["凌晨", "早上", "下午", "晚上"];
            const h = this.getHours();
            if (h == 12) str = "中午";
            else str = hour[parseInt(h / 6)];
            str = this.format("MM月dd ") + str;
        }
        str += this.format("HH:ss");
        return str;
    }
    var time = new Date().format("yyyy-MM-dd HH:mm")
    info = cons || "";
    _.ajax({
        url: "http://route.showapi.com/60-27",
        data: {

            showapi_appid: 94674,
            showapi_sign: "c248072c3eb84dcf8f9f11a9ac4f334b",
            info: cons
        },
        dataType: 'JSON',
        success: function (data) {
            var list = data.showapi_res_body.text;
            var l =
                '<div class="content-left"><div class="avatar-l"><img src="/img/avatar1.png" alt=""></div><div class="message-l">' +
                list + '<span class="arrow-l"></span></div></div></div><div class="kefu-time">' + time + '</div>';
            content.innerHTML += l;
            content.scrollTop = content.scrollHeight
        }
    })
    content.scrollTop = content.scrollHeight
}

// btn.onclick = function (e) {
//     var e = e || window.event
//     var cons = ipt.value
//     var r =
//         '<div class="content-right"><div class="avatar-r"><img src="./img/avatar2.png" alt=""></div><div class="message-r">' +
//         cons + '<span class="arrow-r"></span></div></div>'
//     content.innerHTML += r;
//     // getContent(cons)
//     ipt.value = "";
//     if (ipt.value == "") {
//         $('.add-img').css('display', 'block')
//         $('.sub-btn').css('display', 'none')
//     }
//     content.scrollTop = content.scrollHeight
// }
// btn.onmessage() {
//     var e = e || window.event
//     var cons = ipt.value
//     var r =
//         '<div class="content-right"><div class="avatar-r"><img src="./img/avatar2.png" alt=""></div><div class="message-r">' +
//         cons + '<span class="arrow-r"></span></div></div>'
//     content.innerHTML += r;
//     // getContent(cons)
//     ipt.value = "";
//     if (ipt.value == "") {
//         $('.add-img').css('display', 'block')
//         $('.sub-btn').css('display', 'none')
//     }
//     content.scrollTop = content.scrollHeight
// }
// btn.onclick = onmessage() {

// }
//软键盘弹起时让聊天内容回滚到最上面
$(function () {
    var timerId = null;

    function onFocus(e) {
        let cnt = 0;
        setInterval(() => {
            if (cnt < 3) {
                cnt++;
            } else {
                clearInterval(timerId);
                timerId = null;
                return;
            }
            var frw_scl = document.querySelector('.kefu-body');
            frw_scl.scrollTop = frw_scl.scrollHeight;
        }, 300);
    }

    function onBlur(e) {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
    }
    $("#con").focus(function () {
        onFocus()
    })
    //当聊天输入框获取焦点时
    $("#con").on("keyup", function (event) {});
})
//点击其他区域关闭聊天页面底部的功能区
$('.kefu_wrapper').on('touchend', function () {
    if ($('.app_kfooter_gn').css('display') === 'none') {
        $('.app_kfooter_gn').hide(2000);
        $('.app_content_bd').css({
            'transition': 'all 0.3s',
            '-webkit-transition': 'all 0.3s',
            /* Safari */
            'bottom': '13.0667vw',

        })
        onBlur()
    } else if ($('.app_kfooter_gn').css('display') === 'block') {
        $('.app_kfooter_gn').hide(2000);
        // console.log('隐藏')
        $('.app_content_bd').css({
            'transition': 'all 0.3s',
            '-webkit-transition': 'all 0.3s',
            /* Safari */
            'bottom': '13.0667vw',
        })
        onBlur()
    }
});
$(function () {
    $('.add-img').on('tap', function () {
        $('.kefu-bottom').css('height', '48.533vw')
        $('.kefu-body').css('bottom', '48vw')
        content.scrollTop = content.scrollHeight
        $(this).css('transform', 'rotate(45deg)')
    })
    $('.kefu-body').on('touchend', function () {
        $('.kefu-bottom').css('height', '13.333vw')
        $('.kefu-body').css('bottom', '13.333vw')
        $('.add-img').css('transform', 'rotate(0deg)')
        $('.ipt').css('display', 'block')
        $('.send-btn').css('display', 'none')
    });
    $('.input_text').on('tap', function () {
        $('.kefu-bottom').css('height', '13.333vw')
        $('.kefu-body').css('bottom', '13.333vw')
        $('.add-img').css('transform', 'rotate(0deg)')

    })
    $('.voice').on('tap', function () {
        $('.ipt').css('display', 'none')
        $('.send-btn').css('display', 'block')
    })
})
// 发送语音部分
/*$(function () {
    var bt_recoding = document.getElementById("bt_recoding");

    //中间黑色边框和里面的内容（录音状态）
    var blackBoxSpeak = document.querySelector(".blackBoxSpeak");
    blackBoxSpeak.style.background =
        "url('/img/ic_record@2x.png')no-repeat 28 16px/65px 104px, url('/ic_record_ripple@2x-9.png')no-repeat 111.2px 32px/28.8px 88px";
    blackBoxSpeak.style.backgroundColor = "rgba(0,0,0,.7)";

    //中间黑色边框和里面的内容（暂停状态）
    var blackBoxPause = document.querySelector(".blackBoxPause");
    blackBoxPause.style.background =
        "rgba(0,0,0,.7) url('/img/ic_release_to_cancel@2x.png')no-repeat center 8px/67.2px 104px";
    blackBoxPause.style.backgroundColor = "rgba(0,0,0,.7)";

    //手指移动相关
    var posStart = 0; //初始化起点坐标
    var posEnd = 0; //初始化终点坐标
    var posMove = 0; //初始化滑动坐标

    //轮播相关
    var index = [9, 8, 7, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var num = index.length;
    var timer = null; //用于清除计时器

    //直接开启轮播模式
    setTimer();*/

    function initEvent() {
        bt_recoding.addEventListener("touchstart", function (event) {
            event.preventDefault(); //阻止浏览器默认行为
            posStart = 0;
            posStart = event.touches[0].pageY; //获取起点坐标
            var mediaRecorder;
            var oChatList = document.getElementById('kefu-body');
            navigator.getUserMedia = (navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia);
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia(
                        // constraints - only audio needed for this app
                        {
                            audio: true
                        })
                    // Success callback
                    .then(function (stream) {
                        rec(stream);
                    })

                    // Error callback
                    .catch(function (err) {});
            } else {}

            //显示录音 隐藏暂停
            showBlackBoxSpeak();

            function rec(stream) {
                mediaRecorder = new MediaRecorder(stream);
                console.log(mediaRecorder)
                mediaRecorder.ondataavailable = function (e) {
                    var clipContainer = document.createElement('div');
                    var audio = document.createElement('audio');
                    console.log(audio)
                    clipContainer.classList.add('yuyin-right');
                    var yuyin_box = $('.yuyin-right').children('.yu-r')
                    console.log(yuyin_box)
                    var audio_c = document.getElementsByTagName('audio')
                    console.log(audio_c)
                    yuyin_box.appendChild(audio_c)
                    clipContainer.innerHTML = `
                    <div class="avatar-r">
                        <img src="/img/avatar2.png" alt="">
                    </div>
                    <div class="yu-r">
                        <span class="bowen">
                        <span class="arrow-r"></span>
                    </div>
                `;
                    audio.setAttribute('controls', '');
                    oChatList.appendChild(clipContainer);
                    var audioURL = window.URL.createObjectURL(e.data);
                    console.log(audioURL + 'fff')
                    audio.src = audioURL;
                    oChatList.addEventListener('touchstart', function (ev) {
                        if (ev.srcElement.parentNode.className !== 'yu-r') return;
                        audio.play();
                        ev.srcElement.parentNode.removeChild(ev.srcElement.parentNode.children[
                            0])
                    }, false);
                    // 滚动条保持在最底部
                    content.scrollTop = content.scrollHeight
                };
            }
        });
        bt_recoding.addEventListener("touchmove", function (event) {
            event.preventDefault(); //阻止浏览器默认行为

            posMove = event.targetTouches[0].pageY; //获取滑动实时坐标
            if (posStart - posMove < 200) {
                //隐藏录音 显示暂停
                showBlackBoxSpeak();
            } else {
                //显示录音 隐藏暂停
                showBlackBoxPause();
            }
        });
        bt_recoding.addEventListener("touchend", function (event) {
            event.preventDefault(); //阻止浏览器默认行为
            posEnd = 0;
            posEnd = event.changedTouches[0].pageY; //获取终点坐标

            //初始化状态
            initStatus();

            if (posStart - posEnd < 200) {
                // alert("发送成功");
                showBlackBoxNone();
            } else {
                // alert("取消发送");
                console.log('发送失败')
                showBlackBoxNone();
            }
        });
    }

    initEvent();

    //轮播
    function setTimer() {
        timer = setInterval(function () {
            setTimeout(function () {
                num++;
                blackBoxSpeak.style.background =
                    "url('img/ic_record@2x.png')no-repeat 28px 16px/64px 104px, url('/img/ic_record_ripple@2x-" +
                    index[num] + ".png')no-repeat 111.2px 32px/28.8px 88px";
                blackBoxSpeak.style.backgroundColor = " rgba(0,0,0,.7)";
            }, 70);
            if (num >= index.length - 1) {
                num = 0;
            }
        }, 70);
    }

    //初始化状态
    var initStatus = function () {
        bt_recoding.value = '按住 说话';

        //全部隐藏
        showBlackBoxNone();
    }

    //显示录音 隐藏暂停
    var showBlackBoxSpeak = function () {
        bt_recoding.value = '松开 结束';
        blackBoxSpeak.style.display = "block";
        blackBoxPause.style.display = "none";
    }

    //隐藏录音 显示暂停
    var showBlackBoxPause = function () {
        bt_recoding.value = '松开手指，取消发送';
        blackBoxSpeak.style.display = "none";
        blackBoxPause.style.display = "block";
    }

    //隐藏录音
    var showBlackBoxNone = function () {
        blackBoxSpeak.style.display = "none";
        blackBoxPause.style.display = "none";
    }
// })
