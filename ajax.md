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
            var str = xhr.responseText;
            console.log(typeof str); //string

            var obj = JSON.parse(str);
            console.log(typeof obj); // object
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
    response.setHeader('Content-Type', 'text/xml;charset=utf-8');
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

## CORS解决同源策略限制



