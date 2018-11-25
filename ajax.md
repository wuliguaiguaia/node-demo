## 总结
1. 用 form 可以发请求，但是会刷新页面或新开页面
2. 用 a 可以发 get 请求，但是也会刷新页面或新开页面
3. 用 img 可以发 get 请求，但是只能以图片的形式展示
4. 用 link 可以发 get 请求，但是只能以 CSS、favicon 的形式展示
5. 用 script 可以发 get 请求，但是只能以脚本的形式运行

## 请求升级
**ajax**
```js
var xhr = new XMLHttpRequest();
xhr.onreadystatechange =()=>{
    if(xhr.readyState === 4){
        if(xhr.status >= 200 && xhr.status < 300){
            var obj = JSON.parse(xhr.responseText);
        }else if(xhr.status >= 400){
            
        }
    }
}
xhr.open("post", "/xxx");
xhr.send('{ "color": "red" }');
```
node.js
```js
if(path === "/xxx"){
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/json;charset=utf-8');
    response.write(`
    {
        "person":{
        "name":"alias",
        "sex":"girl",
        "age":18
        }
    }
    `);
    response.end()
}
```

## CORS(Cross-Origin Resource Sharing)解决同源策略限制(协议+域名+端口)
example：jack.com 访问 alias.com/xxx
```js
xhr.open("get", "http://alias.com:8002/xxx");
xhr.send(null);
```

node.js alias.com后台允许jack.com 获取资源
```js
response.setHeader('Access-Control-Allow-Origin', 'http://jack.com:8001');
```


## 封装jquery的ajax
```js
window.jQuery.ajax = function({url,type,data,success,error,headers}) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = handler;
    xhr.open(type,url);
    for(let key in headers){
        xhr.setRequestHeader(key,headers[key]);
    }
    xhr.send(data);

    function handler() {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                success.call(undefined,xhr.responseText)
            } else {
                error.call(undefined,xhr);
            }
        }
    }
}
```

## promise
解决回调的问题：统一回调形式

ajax返回一个promise实例，实例有一个then属性

如果需要对结果多次处理，就多次then,注意每次then的处理方式

ajax封装升级
```js
window.jQuery.ajax = function ({ url, type, data, headers }) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        //...
    }
}
let promise = $.ajax({
    url: '/xxx',
    type: 'post',
    data: "name=alias&pass=xxx",
})

promise.then((res) => {
    console.log('success1', res);
    return 'success2'
}, (res) => {
    console.log('error1', res);
    return 'error2'
}).then((res) => {
    console.log(2);
    console.log(res);
}, (res) => {
    console.log('2x');
    console.log(res);
})
```



NOTE: node server.js 8888 >! log 2>&1 &