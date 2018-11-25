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

// window.Promise = (fn) => {
//     ...
//     return {
//         then() { }
//     }
// }

window.jQuery.ajax = function ({ url, type, data, headers }) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = handler;
        xhr.open(type, url);
        for (let key in headers) {
            xhr.setRequestHeader(key, headers[key]);
        }
        xhr.send(data);

        function handler() {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve.call(undefined, xhr.responseText)
                } else {
                    reject.call(undefined, xhr);
                }
            }
        }
    })
}

let promise = $.ajax({
    url: '/xxx',
    type: 'post',
    data: "name=alias&pass=xxx",
    dataType: "text",
    headers: {
        'Content-type': "application/xxx-form-urlencoded",
        'alias': '18'
    }
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