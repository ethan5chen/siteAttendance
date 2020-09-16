laydate.render({
	elem: '#startDate'
	, type: 'month'
});
laydate.render({
	elem: '#endDate'
	, type: 'month'
});
$(function () {
	var person = sessionStorage.getItem('username');
	var productCode = sessionStorage.getItem('productCode');
	var productName = sessionStorage.getItem('productName');
	console.log(productName);
	console.log(person);
	if (person == "admin") {        //管理员则获取所有项目
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
		
	} else {  //普通管理员则回显其对应的项目
		$('#project').remove();
		$('#projectName').val(productName);
	}
	$(document).on('click', '#query', function (event) {
		if ($('#project').val() == "请选择" || $('#date').val() == "请选择") {
			alert("请选择查询条件");
			return;
		}
		if (person == "admin") {
			productName = $('#project').val();
		}
		$('#table').bootstrapTable('destroy');
		$('#table').bootstrapTable({
			url: url + '/otherFunc/showGroupWages',
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
					startDate: $("#startDate").val(),
					endDate: $("#endDate").val(),
				}
			},
			columns: [{
				field: 'date',
				title: '月份',
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
				field: 'teamLeader',
				title: '班组长',
				sortable: true,
			}, {
				field: 'cellPhone',
				title: '联系电话',
				sortable: true,
			}, {
				field: 'wages',
				title: '工资合计（元）',
				sortable: true,
			}]
		});
	});
});



















