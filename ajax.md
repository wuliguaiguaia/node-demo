## 总结
用 form 可以发请求，但是会刷新页面或新开页面
用 a 可以发 get 请求，但是也会刷新页面或新开页面
用 img 可以发 get 请求，但是只能以图片的形式展示
用 link 可以发 get 请求，但是只能以 CSS、favicon 的形式展示
用 script 可以发 get 请求，但是只能以脚本的形式运行

## 请求升级
**ajax**
```js
var xhr = new XMLHttpRequest();
xhr.onreadystatechange =()=>{
    if(xhr.readyState === 4){
        if(xhr.status === 200){
            var obj = JSON.parse(xhr.responseText);
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


