/* 
  不能让外部的变量污染插件变量
  不能让插件变量污染外部的变量
*/

;(function (window) {
  function serialize (params) {
    // 要把对象转换为字符串 key=value&key=value
    var arr = []
    for(var key in params) {
      arr.push(key + '=' + params[key])
    }
    return arr.join('&')
  }  

  // window
  var ajax = {
    get: function (url, callback) {
      var xhr = new XMLHttpRequest()
      xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200){
          callback && callback(xhr.responseText)
        }
      }
      xhr.open('GET', url, true)
      xhr.send()
    },
    post: function (url, params, callback) {
      var xhr = new XMLHttpRequest()
      xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200){
          callback && callback(xhr.responseText)
        }
      }
      xhr.open('POST', url, true)
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      var data = typeof params === 'string' ? params : serialize(params)
      xhr.send(data)
    },
    getJSON: function (url, callback) {
      var xhr = new XMLHttpRequest()
      xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200){
          callback && callback(JSON.parse(xhr.responseText))
        }
      }
      xhr.open('GET', url, true)
      xhr.send()
    },
    ajax: function (opt) {
      // 1 先设置相关参数的默认值
      var 
        url = opt.url || '',
        type = opt.type || 'GET',
        data = opt.data || '',
        dataType = opt.dataType || 'TEXT',
        success = opt.success || null,
        error = opt.error || null

      // 判断data传递的是对象还是字符串
      if (typeof data !== 'string') {
        data = serialize(data)
      }

      // 2 把GET和POST请求相同的内容写出来
      var xhr = new XMLHttpRequest()
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          // 表示成功 判断dataType的值，给success函数传入对应类型的值
          dataType = dataType.toUpperCase()
          if (dataType === 'TEXT') {
            success && success(xhr.responseText)
          } else if (dataType === 'JSON') {
            success && success(JSON.parse(xhr.responseText))
          } else if (dataType === "XML") {
            success && success(xhr.responseXML)
          }
        } else if (xhr.readyState === 4 && xhr.status === 404) {
          error && error(xhr.statusText)
        }
      }

      // 3 根据使用者传递的type值判断是使用GET还是使用POST
      if (type.toUpperCase() === "GET") {
        // 处理url 如果用户传递了data就拼接，没有传递则还是url
        url = data ? url + "?" + data : url
        // 按GET请求发送
        xhr.open('GET', url, true)
        xhr.send()
      } else if (type.toUpperCase() === "POST") {
        // 按POST请求发送
        xhr.open('POST', url, true)
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
        xhr.send(data)
      }
    }
  }

  window._ = ajax  // 把ajax对象暴露到全局中
}(window))