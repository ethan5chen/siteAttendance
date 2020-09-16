$(function () {
	var person = sessionStorage.getItem('username');
	//防止用户四个选项都选择的情况下查看完统计数据后，后退接着查看所导致的选择店铺选项值没有重置的问题
	$('#shop').val("");
	//获取所有项目
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
				$.each(result.data, function (index, item) {
					$('#team').append('<option value=' + item.teamName + '>' + item.teamName + '</option>');
				});
			}
		});
	});
});

$(document).on('click', '#query', function (event) {
	if($('#project').val()=="请选择"||$('#team').val()=="请选择"||$('#team').val()==null||$('#date').val()=="")
	{
		alert("请选择查询条件");
		return;
	}	
	$('#table').bootstrapTable('destroy');
	$('table').bootstrapTable({
		url: url+'/otherFunc/showLinks',
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
				projectName: $('#project').val(),
				teamName: $('#team').val(),
				startDate: $("#startDate").val(),
				endDate: $("#endDate").val(),
			}
		},
		columns: [ {
			field: 'date',
			title: '日期',
			sortable: true,
		},{
			field: 'projectName',
			title: '项目名称',
			sortable: true,
		}, {
			field: 'teamName',
			title: '班组名称',
			sortable: true,
		}, {
			field: 'trueIdcard',
			title: '真实工人证件号',
			sortable: true,
		}, {
			field: 'trueWorkerName',
			title: '真实工人姓名',
			sortable: true,
		},  {
			field: 'linkIdcard',
			title: '关联工人证件号',
			sortable: true,
		},  {
			field: 'linkWorkerName',
			title: '关联工人姓名',
			sortable: true,
		},  {
			field: 'inTime',
			title: '进场时间',
			sortable: true,
		},  {
			field: 'outTime',
			title: '出场时间',
			sortable: true,
		},  {
			field: 'length',
			title: '本次工作时长',
			sortable: true,
		}]
	});
});


