# 浏览器发送请求的前世今生

## 范例约定
1. 文章采用数据库之文件系统（把文件当数据库），点击button[pay $1], db文件的数值减1。(每次付1美元)
```
    node server 8888
```

2. 模拟请求另一个网站的script：修改 /etc/hosts 文件
```
    127.0.0.1 alias.com
    127.0.0.1 jack.com
```
约定端口：
```
    PORT=8001 server 8001 > jack.com > 模拟发送端
    PORT=8002 server 8002 > alias.com >  模拟响应端
```

3. &&&amount&&& 为 占位符
4. 无法局部刷新 使用window.location.reload()强制全局刷新

## form发送请求
```html
<h1>你的账户余额 <span id="amount"> &&&amount&&& </span></h1>
<form action="/pay" method="post">
    <input type="submit" value="pay $1">
</form>
```
node
```js
if (path === '/') {
    var string  = fs.readFileSync("./index.html",'utf8');
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    var amount = fs.readFileSync("./db",'utf8')
    string = string.replace('&&&amount&&&',amount);  
    response.write(string)   
    response.end()
} else if(path === '/pay' && method.toUpperCase()==="POST"){ //assign post request
    var amount = fs.readFileSync("./db",'utf8') 
    amount -= 1;
    if(Math.random() > 0.5){   // simulate possible defeat request
        fs.writeFileSync('./db',amount);
        response.write('success');
    }else{
        response.write('fail');
    }
    response.end();
}
```
问题：form提交必须手动刷新页面

## 局部刷新

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
node
```js
if(path === '/pay' ){
    var amount = fs.readFileSync("./db",'utf8') 
    amount -= 1;
    fs.writeFileSync('./db',amount);
    response.setHeader("Content-Type",'image/png');
    response.statusCode = 200;
    response.write(fs.readFileSync("./img.png"))
    response.write('success');
    response.end();
}
```
问题：img模拟可以实现局部刷新，但必须上传图片耗资源，而且只知道成功和失败，无法获取其他信息

### 方案二：script造get请求 【 SRJ - Server Rendered JavaScript 】

```javascript
button.onclick = () => {
    let script = document.createElement('script');
    script.src = 'http://alias.com:8002/pay'; //send a request
    document.body.appendChild(script);
    script.onerror = () => {
        alert("request error");
    }
    setTimeout(() => { // must delete script
        script.remove();
    }, 0);
}
```
node
```js
if (path === '/pay') {  
    var amount = fs.readFileSync("./db", 'utf8')
    var newAmount = amount - 1;
    fs.writeFileSync('./db',newAmount);
    
    response.setHeader("Content-Type", 'application/javascript');
    response.statusCode = 200;
    response.write(`amount.innerText = ' + ${amount};`) 
    response.end();
}
```
问题：后端必须知道前端代码。ps:上面需要手动刷新


### 方案三：jsonp
请求方：jack.com 的前端程序员（浏览器）
响应方：alias.com 的后端程序员（服务器）

1. 请求方创建 script，src 指向响应方，同时传一个查询参数 ?callbackName=xxx
2. 响应方根据查询参数callbackName，构造形如
    - xxx.call(undefined, '你要的数据')
    - xxx('你要的数据')
3. 浏览器接收到响应，就会执行 xxx.call(undefined, '你要的数据')
4. 那么请求方就知道了他要的数据
这就是 JSONP。

```js
let script = document.createElement('script');
let randomName = 'alias' + parseInt(Math.random()*100000,10); // random function name
window[randomName] =function(res){
    if(res === 'success'){
        amount.innerText -= 1;
    }else{

    }
}
script.src = `http://alias.com:8002/pay?callback=${randomName}`; //send a request
document.body.appendChild(script);
script.onerror = () => {
    alert("request error");
}
setTimeout(() => {
    script.remove();
    delete window[randomName];
}, 500);
```
node
```js
response.write(`
    ${query.callback}.call(undefined, "success")
`) 
```
### 约定：
```
callbackName > callback
yyy > 随机数 alias4513264512568745()
```

### 方案四：jquery 封装的方法 --- jsonp思路（！这和ajax无关！）
```js
 button.onclick = () => {
    $.ajax({
        url: "http://alias.com:8002/pay",
        dataType: "jsonp",
        success: function (response) {
            if (response === 'success') {
                amount.innerText -= 1;
            }
        }
    })
}
```
node
```js
response.write(`
    ${query.callback}.call(undefined, "success" )
`) 
```


### 为什么jsonp不支持post?
因为jsonp是通过动态创建script实现的，动态创建script只能用get。

