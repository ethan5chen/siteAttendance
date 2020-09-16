// let url="http://47.98.223.167:8081/WorkAttendant";
let url="http://47.98.223.167:8082/WorkAttendant";
 // let url="https://www.zjqirui.xyz/exam/";UEditor


function getQueryString(name) {
  let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  let r = window.location.search.substr(1).match(reg);
  if(r!=null)return  unescape(r[2]); return null;
}

