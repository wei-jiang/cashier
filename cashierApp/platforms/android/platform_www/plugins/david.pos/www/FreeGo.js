cordova.define("david.pos.Pos", function(require, exports, module) {
var exec = require('cordova/exec');

exports.echo = function (arg0, success, error) {
    exec(success, error, 'Pos', 'echo', [arg0]);
};
exports.scan_by_camera = function (success, error) {
    exec(success, error, 'Pos', 'scan_by_camera', []);
};
exports.req_pay = function (out_trade_no, body, total_fee, auth_code, success, error) {
    exec(success, error, 'Pos', 'req_pay', [out_trade_no, body, total_fee, auth_code]);
};
exports.exit = function () {
    exec(function(){}, function(){}, 'Pos', 'exit', []);
};
});
