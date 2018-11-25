window.jQuery = (selector) => {
    let nodes = {
        0: selector,
        length: 0
    }
    nodes.addClass = () => { };
    nodes.html = () => { };
    return nodes;
}

window.$ = window.jQuery;

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

$.ajax({
    url:'/xxx',
    type: 'post',
    data: "name=alias&pass=xxx",
    dataType:"text",
    headers:{
        'Content-type':"application/xxx-form-urlencoded",
        'alias':'18'
    },
    success(res){
        f1.call(undefined,res);
        f2.call(undefined);
    },
    error(res){
        console.log(res);
    }
})

function f1(res){
    console.log(res);
}
function f2(){
    console.log(2);
}