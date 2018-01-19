/*
    *vue通用工具方法
    *1.queryString-字符串截取
    *2.cookie-cookie存储读取
    *3.setStore、getStore、removeStore-localStorage设置读取删除
    *4.getStyle获取元素样式
    *5.throttle节流函数
*/
export const queryString = (name, url = window.location.href) => {
    if (name !== undefined) {
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    else {
        let pairs = location.search.slice(1).split('&');

        let result = {};
        if (pairs === ['']) { return {}; }
        for (let i = pairs.length - 1, pair; i > -1; i--) {
            pair = pairs[i].split('=');
            result[pair[0]] = decodeURIComponent(pair[1] || '');
        }
        return JSON.parse(JSON.stringify(result));
    }
};

export const cookie = {
  getItem: function (sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!sKey || !this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: /* optional method: you can safely remove it! */ function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};

export const setStore = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
}

export const getStore = name => {
	if (!name) return;
	return window.localStorage.getItem(name);
}

export const removeStore = name => {
	if (!name) return;
	window.localStorage.removeItem(name);
}

export const getStyle = (element, attr, NumberMode = 'int') => {
    let target;
    if (attr === 'scrollTop') { 
        target = element.scrollTop;
    }else if(element.currentStyle){
        target = element.currentStyle[attr]; 
    }else{ 
        target = document.defaultView.getComputedStyle(element,null)[attr]; 
    }
    return  NumberMode == 'float'? parseFloat(target) : parseInt(target);
}

export const formpost = (url, params) => {
  if (typeof (params) === 'string') {
    let qs = require('querystring')
    params = qs.parse(params)
  }
  if (Object.prototype.toString.call(params) === '[object Object]') {
    let temp_form = document.createElement('form')
    temp_form.action = url
    temp_form.method = 'post'
    temp_form.style.display = 'none'
    for (var x in params) {
      let opt = document.createElement('textarea')
      opt.name = x
      opt.value = params[x]
      temp_form.appendChild(opt)
    }
    document.body.appendChild(temp_form)
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      xhr.open('post', url, true)
      xhr.onreadystatechange = (res) => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          resolve()
        } else {
          reject()
        }
        temp_form.submit()
      }
      xhr.send()
    })
  }
}