// let url="http://211.149.250.19:8081/cigaQues/";
// let url="https://zhenjiangyancao.xyz/cigaQues/";
let url="http://47.98.223.167:8082/WorkAttendant";
// let url="http://47.98.223.167:8081/WorkAttendant";

// function getQueryString(name) {
//   let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
//   let r = window.location.search.substr(1).match(reg);
//   if(r!=null)return  unescape(r[2]); return null;
// }
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
} 
