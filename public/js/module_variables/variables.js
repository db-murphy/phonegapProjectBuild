define(function (require,exports,module){

    //请求IP
    var IP = "http://192.168.0.224:3000/";
    var BASE_PATH = IP + "api/";

    //接口URL
    var HTTP_PORT = {
        CHCKLOGIN: 'checklogin',
        LOGIN_URL: 'login',
        REGISTER_URL: 'register',
        GETPHONEGAPPLUGIN_URL: 'getPhonegapPlugin',
        OURTEAMPLUGIN_URL: 'ourTeamPlugin',
        CREATEPROJECT_URL: 'createProject',
        SEARCHPLUGIN_URL: 'searchPlugin'
    };

    //lodding效果html结构
    var LOADINGHTMLARR = [
            '<div id="loadingModalMes" class="modal fade bs-example-modal-lg mylodding" tabindex="-1"  role="dialog"  aria-hidden="true">',
                '<div class="modal-dialog modal-lg">',
                    '<div class="modal-content">',
                        '<div class="myContent">正在加载...</div>',
                    '</div>',
                '</div>',
            '</div>'
    ];

    module.exports = {
        IP: IP,
        BASE_PATH: BASE_PATH,
        HTTP_PORT: HTTP_PORT,
        LOADINGHTMLARR: LOADINGHTMLARR
    };

});