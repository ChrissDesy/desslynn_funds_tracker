import * as engine from './apiEngine.js';


async function login(){
    let uname = $('#uname').val();
    let pwd = $('#pwd').val();    

    if(!uname || !pwd){
        engine.showAlert('warn', 'Please fill in all fields.', 'Missing Fields');
        return false;
    }

    let data = {
        uname: uname,
        pwd: pwd
    };

    await engine.authLogin(data).then(
        resp => {
            // console.log(resp);

            if(resp == 400){
                engine.showAlert('error', 'Something wrong with your data : 400', 'Request Failed')
                return;
            }

            engine.showAlert('success', 'Authenticated.', 'Request Success');

            // save username
            sessionStorage.setItem('auth', resp.username);

            window.location.href = './dash/home.html';
        }        
    ).catch(
        err => {
            console.error(err);
            engine.showAlert('error', err?.statusText + ': ' + err.status, 'Request Failed');

            return false;
        }
    );

}

$(function(){

    // make dummy request
    engine.makeDummyRequest().then( r => {console.log(r)});

    // btn event handler
    $("#frmLogin").submit(async function(e) {
        e.preventDefault();
        await login();
    });

});