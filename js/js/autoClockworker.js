$(function () {
	$('#table').bootstrapTable({
		url: url+'/otherFunc/showPreCount',
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
				method: "getAutoClockworkerList",
				limit: params.limit,
				page: (params.offset / params.limit) + 1,
			}
		},
		columns: [{
			field: 'workerName',
			title: '姓名',
			sortable: true,
		}, {
			field: 'workerIDCardType',
			title: '证件类型',
			sortable: true,
		}, {
			field: 'workerIDCardNumber',
			title: '证件号码',
			sortable: true,
		}, {
			field: 'gender',
			title: '性别',
			sortable: true,
		}, {
			field: 'workType',
			title: '当前工种',
			sortable: true,
		}, {
			field: 'workRole',
			title: '工人类型',
			sortable: true,
		}, {
			field: 'linkIDCardNumber',
			title: '关联身份证',
			sortable: true,
		}]
	});
});

//
$(document).on('click', '#add-a', function (event) {
	//项目
	$.ajax({
		url: url+'/otherFunc/showPreCount',
		type: 'post',
		dataType: 'json',
		async: false,
		data: {
			method: "getProjectInfo",
			limit: 0,
			page: 0
		},
		success: function (result) {
			$('#projectName').empty();
			$.each(result.data, function (index, item) {
				$('#projectName').append('<option value=' + item.name + '>' + item.name + '</option>');
			});
		}
	});
	//班组
	$.ajax({
		url: url+'/otherFunc/showPreCount',
		type: 'post',
		dataType: 'json',
		async: false,
		data: {
			method: "getTeamInfo",
			limit: 0,
			page: 0
		},
		success: function (result) {
			$('#team').empty();
			$('#team').append('<option value="">请选择</option>');
			$.each(result.data, function (index, item) {
				$('#team').append('<option value=' + item.teamName + '>' + item.teamName + '</option>');
			});
		}
	});
	//工人
	$.ajax({
		url: url+'/otherFunc/showPreCount',
		type: 'post',
		dataType: 'json',
		async: false,
		data: {
			method: "getAllWorkerInfo",
			limit: 0,
			page: 0
		},
		success: function (result) {
			$('#workerName').empty();
			$('#workerName').append('<option value="">请选择</option>');
			$.each(result.data, function (index, item) {
				$('#workerName').append('<option value=' + item.workerName + '>' + item.workerName + '</option>');
			});
		}
	});

	$("#addModal").modal({
		backdrop: 'static',
	});
});
$(document).on('click', '#update-a', function (event) {
	//项目
	$.ajax({
		url: url+'/otherFunc/showPreCount',
		type: 'post',
		dataType: 'json',
		async: false,
		data: {
			method: "getProjectInfo",
			limit: 0,
			page: 0
		},
		success: function (result) {
			$('#update_projectName').empty();
			$.each(result.data, function (index, item) {
				$('#update_projectName').append('<option value=' + item.name + '>' + item.name + '</option>');
			});
		}
	});
	//班组
	$.ajax({
		url: url+'/otherFunc/showPreCount',
		type: 'post',
		dataType: 'json',
		async: false,
		data: {
			method: "getTeamInfo",
			limit: 0,
			page: 0
		},
		success: function (result) {
			$('#update_team').empty();
			$('#update_team').append('<option value="">请选择</option>');
			$.each(result.data, function (index, item) {
				$('#update_team').append('<option value=' + item.teamName + '>' + item.teamName + '</option>');
			});
		}
	});
	//工人
	$.ajax({
		url: url+'/otherFunc/showPreCount',
		type: 'post',
		dataType: 'json',
		async: false,
		data: {
			method: "getAllWorkerInfo",
			limit: 0,
			page: 0
		},
		success: function (result) {
			$('#update_workerName').empty();
			$('#update_workerName').append('<option value="">请选择</option>');
			$.each(result.data, function (index, item) {
				$('#update_workerName').append('<option value=' + item.workerName + '>' + item.workerName + '</option>');
			});
		}
	});

	$("#updateModal").modal({
		backdrop: 'static',
	});
});