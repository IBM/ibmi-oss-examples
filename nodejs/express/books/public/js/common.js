"use strict";

let api = (function() {

    // callback format: code, respText.
    function sendAjax(method, url, data, callback) {
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            callback(xhr.status, xhr.responseText);
        };
        xhr.open(method, url, true);
        if (!data) {
            xhr.send();
        } else{
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
        }
    }

    let module = {};

    module.showError = function(msg) {
        document.querySelector('#error_box').style.display = 'block';
        document.querySelector('#error_message').innerHTML = `<b>${msg}</b>`;
    };

    module.signIn = function(dsn, host, username, password) {
        sendAjax('POST', '/signin', {dsn, host, username, password}, function(code, respText) {
            // on success backend will redirect to /
            // handle error here
            if (code !== 201) return module.showError(`Error from sign in: [${code}], ${respText}`);
            // success: redirect to main page
            window.location.href = '/';
        });
    };

    return module;
})();
