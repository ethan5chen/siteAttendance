laydate.render({
	elem: '#date'
	, type: 'month'
});
$(function () {
	var person = sessionStorage.getItem('username');
	var productCode = sessionStorage.getItem('productCode');
	var productName = sessionStorage.getItem('productName');
	console.log(productName);
	console.log(person);
	if (person == "admin") {    //管理员则获取所有项目
		$('#projectName').remove();
		$.ajax({
			url: url + '/mainFunc/showProjects',
			type: 'post',
			dataType: 'json',
			async: false,
			data: {
				limit: 0,
				page: 0
			},
			success: function (result) {
				$('#project').empty();
				$('#project').append('<option value="请选择">请选择</option>');
				$.each(result.data, function (index, item) {
					$('#project').append('<option value=' + item.name + '>' + item.name + '</option>');
				});
			}
		});
		$("#project").change(function () {
			//获取选中的项目
			let project_select = $('#project').val();
			$("#team").empty();
			$("#worker").empty();
			if (project_select == '请选择')
				return;
			//获取所有班组
			$.ajax({
				url: url + '/mainFunc/getGroups',
				type: 'post',
				dataType: 'json',
				async: false,
				data: {
					projectName: $('#project').val(),
				},
				success: function (result) {
					console.log(result);
					$('#team').empty();
					$('#team').append('<option value="请选择">请选择</option>');
					$.each(result.data, function (index, item) {
						$('#team').append('<option value=' + item.teamName + '>' + item.teamName + '</option>');
					});
				}
			});
		});
	}	else {  //普通管理员则回显其对应的项目
		$('#project').remove();
		$('#projectName').val(productName);
		$.ajax({  
			url: url + '/mainFunc/getGroups',
			type: 'post',
			dataType: 'json',
			async: false,
			data: {
				projectName: productName,
			},
			success: function (result) {
				console.log(result);
				$('#team').empty();
				$('#team').append('<option value="请选择">请选择</option>');
				$.each(result.data, function (index, item) {
					$('#team').append('<option value=' + item.teamName + '>' + item.teamName + '</option>');
				});
			}
		});
	}
	$(document).on('click', '#query', function (event) {
		console.log("trigger!")
		if ($('#project').val() == "请选择" || $('#team').val() == "请选择" || $('#team').val() == null || $('#date').val() == "") {
			alert("请选择查询条件");
			return;
		}
		if (person == "admin") {    
			productName=$('#project').val();
			console.log($('#project').val())
		}
		$('#table').bootstrapTable('destroy');
		$('#table').bootstrapTable({
			url: url + '/otherFunc/showUsersView',
			method: 'post',
			pagination: true,
			search: false,
			dataType: 'json',
			toolbar: '#toolbar',
			striped: true,
			limit: '15',
			pageList: [10, 25, 50, 100],
			showRefresh: false,
			dataField: "data",
			contentType: "application/x-www-form-urlencoded",
			mobileResponsive: true,
			useRowAttrFunc: true,
			sidePagination: 'server',
			pageNumber: 1,
			responseHandler: function (res) {
				res.total = res.count;
				return res;
			},
			queryParams: function (params) {
				return {
					limit: params.limit,
					page: (params.offset / params.limit) + 1,
					projectName: productName,
					teamName: $('#team').val(),
					date: $("#date").val(),
				}
			},
			columns: [{
				field: 'workerName',
				title: '姓名',
				sortable: true,
			}, {
				field: 'idCardNumber',
				title: '证件号',
				sortable: true,
			}, {
				field: 'projectName',
				title: '项目名称',
				sortable: true,
			}, {
				field: 'teamName',
				title: '班组名称',
				sortable: true,
			}, {
				field: 'days',
				title: '出勤工日',
				sortable: true,
			}]
		});
	});
	//导出
	$(document).on('click', "#export", function () {
		if (person == "admin") {    
			productName=$('#project').val();
		}
		$.ajax({
			url: url + '/exportFunc/exportAtt', //expertLeaders
			type: 'post',
			dataType: 'json',
			async: false,
			data: {
				limit:"0",
				page:"0",
				projectName: productName,
				teamName: $('#team').val(),
				date: $("#date").val(),
			},
			success: function (result) {
				result.productName=productName;
				result.teamName=$('#team').val();
				result.date=$("#date").val();
				sessionStorage.setItem("clockCountData",JSON.stringify(result))
				window.location.href="test2.html";
			}
		})
	})
});


