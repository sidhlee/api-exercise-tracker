function Utils() {
    this.ready = function (cb) { // implements jQuery's $(document).ready()
        if (typeof cb !== 'function') {
            return;
        }
        if (document.readyState === 'complete') {
            return cb;
        }

        document.addEventListener('DOMContentLoaded', cb, false); // usecapture = false
    };

    this.ajax = function (options, cb) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () { // set response handler
            if (xhr.readyState === 4) { // req state(0: unsent, 1:opened, 2: headers_received, 3: loading(downloading), 4: done)
                if (Math.floor(xhr.status/100) === 2) { // response status == OK
                    let results = xhr.responseText;
                    const type = xhr.getResponseHeader('Content-Type');
                    if(type.match('applicatoin/json')) { // if res in json format, parse it.
                        console.log("res is json")
                        results = JSON.parse(results);
                        console.log(results);
                    }
                    cb(null, results); // call cb passing data in response
                } else { // if response status is NOT ok
                    cb(xhr); // call cb passing xhr instance
                }
            }    
        };

        const method = options.method || 'get'; // req method. default: 'get'
        let url = options.url || '/'; // req url. default: '/'

        if (url.charAt(url.length -1) === '/') { // remove tailing /
            url = url.slice(0, -1);
        };

        if (options.data) { // if options.data exists
            let query;
            let contentType = "application/x-www-form-urlencoded"; // default content-type
            if (options.type && options.type === 'json') { //if type is json
                query = JSON.stringify(options.data);
                contentType = "application/json";
            } else { // if not json, percent encode search params  
                /* If you want to stay on the page with form submit, you MUST use event.preventDefault() on 'submit'
                   because 'submit' event's default behavior converts form control's name-value pair into query uri 
                   and append it to the URL?, then set the window.location.href with the new URL 
                   When window.location.href is set with new value, the browser WILL REDIRECT to that url after the server response and client script
                   RECAP: If you want to stay on the page, can't use window.location to get query string. 
                */
               
                /* const entries = (new URL(window.location.href)).searchParams.entries(); // returns new entries iterator from searchParams instance
                
                console.log("entries: ", entries);
                const params = {};
                for (let entry of entries) { // convert entries iterator to object
                    console.log("entry: ", entry);
                    const [key, value] = entry;
                    params[key] = value;
                }
                console.log("params: ", params);
                query = [];
                for (var key in params) {
                    query.push(key + '=' + encodeURIComponent(params[key]));
                    query.push('&'); 
                }
                query.pop(); // remove the last '&'
                query = query.join('') */
                query = $(options.data).serialize();
            }

            switch(method.toLowerCase()) {
                case 'get':
                    url += ('?' + query);
                    xhr.open(method, url, true);
                    xhr.send();
                    break;
                case 'put':
                case 'patch':
                case 'delete':
                case 'post':
                    xhr.open(method, url, true);
                    xhr.setRequestHeader("Content-Type", contentType);
                    xhr.send(query); // send reqest with percent-encoded query
                    break;
                default:
                    return;
            }
        } else { // if no option , request with default method(get) and url('/')
            xhr.open(method, url, true);
            xhr.send();
        }
    };  
}

const utils = new Utils();

utils.ready(function() {
    const newUser = document.getElementById('new-user');
    const userInfo = document.getElementById('user-info');
    const addexercise = document.getElementById('add-exercise');
    const getUserLog = document.getElementById('get-user-log');
    const log = document.getElementById('log');

    newUser.addEventListener('submit', function(e) {
        const username = e.target[0]
        e.preventDefault();
        const options = {
            method: 'post',
            url: '/api/exercise/new-user',
            type: 'json',
            data: { [username.name]: username.value }
        };
        userInfo.innerHTML = '<p>Loading...</p>';
        utils.ajax(options, function(err, res) {
            const resObj = (typeof res === 'string') ? JSON.parse(res): res;
            userInfo.innerHTML = (err) ? '<span>' + err.responseText + '</span>' :
            '<span>username: ' + resObj.username + '</span>' +
            '<span>id: ' + resObj._id + '</span>';
        });
    })

    addexercise.addEventListener('submit', function(e) {
        e.preventDefault();
        const options = {
            method: 'post',
            url: '/api/exercise/add',
            type: 'json',
            data: bodyFromEvent(e)
        };
        log.innerHTML = '<p>Loading...</p>';
        utils.ajax(options, function(err, res) {
            if (err) {
                log.innerHTML = err.responseText;
                return console.log(err);
            }
            log.innerHTML = jsonToLogString(res); 
        });
    })

    getUserLog.addEventListener(/* 'get' */"submit", function(e) { //[BUG] kept being redirected
        e.preventDefault(); // If you want to stay on the page, this is a MUST.
        const options = {
            method: 'get',
            url: '/api/exercise/log',
            data: this  // <form> element for $.serialize() to encode query string
        };
        log.innerHTML = '<p>Loading...</p>';
        utils.ajax(options, function(err, res) {
            if (err) {
                log.innerHTML = err.responseText; 
                return console.log(err);
            }
            log.innerHTML = jsonToLogString(res);
        });
    })

})

function jsonToLogString(res) {
    const resObj = (typeof res === 'string') ? JSON.parse(res) : res ;
    let result = '<div class="log-items">';
    const keys = Object.keys(resObj);
    keys.forEach(key => {
        if (!Array.isArray(resObj[key])) {
            result += "<p>" + key + ": " + resObj[key] + "</p>";
        }
        else {
            result +="<p>" + key + ":</p>";
            resObj[key].forEach(o => {
                result += "<div class='log-item'>";
                let keys = Object.keys(o);
                keys.forEach(key => {
                    result += "<p>" + key + ": " + o[key] + "</p>"                        
                })
                keys += "</div>"
            })
        }
    })
    result += "</div>"
    return result;
}

function bodyFromEvent(e) {
    const o = {};
    for (let i = 0; i < e.target.length; i++) {
        let name = e.target[i].name,
            value = e.target[i].value;
        if(name) {
            o[name] = value;
        }
    }
    return o;
}