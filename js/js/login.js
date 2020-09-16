$(function(){
	//登录
	$(document).on('click',"#submit",function () {
		$.ajax({
			url: url+'/user/login',
			type: 'post',
			dataType: 'json',
			// dataType: 'jsonp',  
			// crossDomain: true, 
			data: {
				method: 'login',
				account: $('#username').val(),
				pwd:$('#password').val(),
			},
			success: function (result) {
				console.log(result);
				console.log(result.data);
				console.log(result.code);
				if (result.code === 0) {
					sessionStorage.setItem("username", $('#username').val());
					sessionStorage.setItem("productName", result.data.projectName);
					sessionStorage.setItem("productCode", result.data.projectCode);
					
					swal(
						'登录成功!',
						result.msg,
						'success'
						).then(function(){
							
							window.location.href = "index.html";
							
						});
					}else if(result.code===1){
						swal(
							'登录失败!',
							result.message,
							'error'
							);
					}
				},
				error: function () {
					swal(
						'登录失败!',
						'网络错误',
						'error'
						);
				}
			})
		
	});
});