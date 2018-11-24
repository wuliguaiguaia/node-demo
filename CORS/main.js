button.onclick = () => {
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
    xhr.open("get", "http://alias.com:8002/xxx");
    xhr.send(null);
}