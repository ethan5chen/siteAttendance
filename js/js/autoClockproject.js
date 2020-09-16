laydate.render({
	elem: '#signIn_time'
	, type: 'time'
	, range: true
});
laydate.render({
	elem: '#signOut_time'
	, type: 'time'
	, range: true
});

$(function () {
	$('table').bootstrapTable({
		url: url,
		method: 'get',
		pagination: true,
		dataType: 'json',
		toolbar: '#toolbar',
		striped: true,
		pageSize: '15',
		pageList: [10, 25, 50, 100],
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
				method: "getAutoClockprojectList",
				pageSize: params.limit,
				pageIndex: (params.offset / params.limit) + 1,
			}
		},
		columns: [{
			field: 'projectName',
			title: '项目名称',
			sortable: true,
		}, {
			field: 'entryStartTime',
			title: '进场开始时间',
			sortable: true,
		}, {
			field: 'entryEndTime',
			title: '进场结束时间',
			sortable: true,
		}, {
			field: 'exitStartTime',
			title: '退场开始时间',
			sortable: true,
		}, {
			field: 'exitEndTime',
			title: '退场结束时间',
			sortable: true,
		}, {
			field: 'null',
			title: '操作',
			formatter: actionFormatter,
		}]
	});

	//渲染按钮
	function actionFormatter(value, row, index) {
		let id = row.id;
		let result = "";
		console.log(row.isClose);
		if (row.isClose == "true") //true为已关闭
			result += "<button class='btn btn-xs btn-danger closeButton'  role_id=" + id + " title='关闭' disabled><span>关闭</span></button>";
		else
			result += "<button class='btn btn-xs btn-danger closeButton'  role_id=" + id + " title='关闭'><span>关闭</span></button>";
		// result += "<button class='btn btn-xs btn-primary editButton' row='" + JSON.stringify(row) + "' role_id=" + id + " title='修改'><span>修改</span></button>";

		return result;
	}

	//
	$(document).on('click', '#add-a', function (event) {
		$('#signIn_time').val("");
		$('#signOut_time').val("");
		//项目
		$.ajax({
			url: url,
			type: 'get',
			dataType: 'json',
			async: false,
			data: {
				method: "getProjectInfo",
				pageSize: 0,
				pageIndex: 0
			},
			success: function (result) {
				$('#projectName').empty();
				$.each(result.data, function (index, item) {
					$('#projectName').append('<option value=' + item.name + '>' + item.name + '</option>');
				});
			}
		});

		$("#addModal").modal({
			backdrop: 'static',
		});
	});

	//add
	$(document).on('click', '#add', function (event) {
		$.ajax({
			url: url,
			type: 'get',
			dataType: 'json',
			data: {
				method: "addAutoClockProject",
				projectName: $('#projectName').val(),
				entryStartTime: $('#signIn_time').val(),
				entryEndTime: $('#signIn_time').val(),
				exitStartTime: $('#signOut_time').val(),
				exitEndTime: $('#signOut_time').val(),
				// isClose: "否",
			},
			success: function (result) {
				console.log(result);
				if (result.code === 0) {
					swal(
						'添加成功!',
						result.message,
						'success'
					);
					$("#addModal").modal("hide");
					$("#table").bootstrapTable('refresh');
				} else if (result.code === 1) {
					swal(
						'添加失败!',
						result.message,
						'error'
					);
				}
			},
			error: function () {
				swal(
					'添加失败!',
					'网络错误',
					'error'
				);
			},
		});
	});

	//delete
	let roleName;
	let role_id;
	$(document).on('click', '.closeButton', function (event) {
		let closePrompt = $("#close-prompt");
		//首先清空模态框的提示信息
		closePrompt.empty();
		console.log($(this).attr('role_id'));
		role_id = $(this).attr('role_id');
		$("#closeModal").modal({
			backdrop: 'static',
		});
		//回显需要关闭的属性的名称
		roleName = $(this).parent().prev().prev().prev().prev().prev().text();
		//提示信息
		closePrompt.append("您是否要关闭:" + roleName);

	});

	//关闭模态框确认按钮绑定事件
	$(document).on('click', "#close-confirm-button", function () {

		$.ajax({
			url: url,
			dataType: "json",
			data: {
				method: "closeAutoClockProject",
				id: role_id,
			},
			success: function (result) {
				if (result.code === 0) {
					swal(
						'关闭成功!',
						result.message,
						'success'
					);
					$("#closeModal").modal("hide");
					//刷新表格
					$("#table").bootstrapTable('refresh');
				} else if (result.code === 1) {
					swal(
						'关闭失败!',
						result.message,
						'error'
					);
				}
			},
			error: function () {
				swal(
					'关闭失败!',
					'网络错误',
					'error'
				);
			}
		});
	});

})