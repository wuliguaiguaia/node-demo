##数据库做加法
```html
<h1>你的账户余额 <span id="amount"> &&&amount&&& </span></h1>
<form action="/pay" method="post" target="result">
    <input type="submit" value="pay $1">
</form>

<!-- form提交一定会刷新当前页面 -->
<iframe name="result"  src="about:blank" frameborder="0" height="200"></iframe>
```

##局部刷新
### 方案一：img造get请求

```javascript
button.onclick = () => {
    let image = document.createElement('img');
    image.src = '/pay'; //send a request
    image.onload = () => {
        alert('request success');
        amount.innerText = amount.innerText - 1;
    }
    image.onerror = () => {
        alert("request error");
    }
}
```
```js
response.write(fs.readFileSync("./img.png"))
```

### 方案二：script造get请求 【 SRJ - Server Rendered JavaScript 】

```javascript
button.onclick = () => {
    let script = document.createElement('script');
    script.src = 'http://alias.com:8002/pay'; //send a request
    document.body.appendChild(script);
    script.onerror = () => {
        alert("request error");
    }
    setTimeout(() => {
        script.remove();
    }, 0);
}
```
```js
response.write('amount.innerText = ' + amount)
```

#### 方案二升級 
```js
window.callfn = (res) => {
    if(res === 'success'){
        amount.innerText -= 1;
    }
}
button.onclick = () => {
    let script = document.createElement('script');
    script.src = 'http://alias.com:8002/pay?callbackName=callfn'; //send a request
    document.body.appendChild(script);
    script.onerror = () => {
        alert("request error");
    }
    setTimeout(() => {
        script.remove();
    }, 1000);
}
```

```js
response.write(`
    ${query.callbackName}.call(undefined,'success')
`) 
```

### 方案三：jsonp
请求方：jack.com 的前端程序员（浏览器）
响应方：alias.com 的后端程序员（服务器）

1. 请求方创建 script，src 指向响应方，同时传一个查询参数 ?callbackName=yyy
2. 响应方根据查询参数callbackName，构造形如
    - yyy.call(undefined, '你要的数据')
    - yyy('你要的数据')
        这样的响应
3. 浏览器接收到响应，就会执行 yyy.call(undefined, '你要的数据')
4. 那么请求方就知道了他要的数据
这就是 JSONP

### 约定：
callbackName -> callback
yyy -> 随机数 frank12312312312321325()

 $.ajax({
 url: "http://jack.com:8002/pay",
 dataType: "jsonp",
 success: function( response ) {
     if(response === 'success'){
     amount.innerText = amount.innerText - 1
     }
 }
 })

 $.jsonp()