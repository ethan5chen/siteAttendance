$(function () {
	var person = sessionStorage.getItem('username');

	if (person != 'admin') {
		$('#manager_name').val(person);
		$('#manager_name').attr('disabled', true);
	} else {
		$('#manager_name').attr('disabled', false);
	}
	$('#table').bootstrapTable({
		url: url+'/user/showAdmin',
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
			}
		},
		columns: [{
			field: 'account',
			title: '账号名',
			sortable: true,
		}, {
			field: 'projectName',
			title: '对应项目',
			sortable: true,
		}, {
			field: 'null',
			title: '操作',
			formatter: actionFormatter,
		}]
	});
	//渲染按钮
	function actionFormatter(value, row, index) {
		let account = row.account;
		// delete row.ability;
		console.log(JSON.stringify(row));
		let result = "";
		result += "<button class='btn btn-xs btn-primary resetPwd' role_id=" + account + " title='重置密码'><span>重置密码</span></button>";
		if(account!="admin"){
			result += "<button class='btn btn-xs btn-danger deleteButton'  role_id=" + account + " title='删除'><span>删除</span></button>";
		}
		return result;
	}

	//
	$(document).on('click', '#add-a', function (event) {
		$('#ManagerAccountName').val("");
		//项目
		$.ajax({
			url: url+'/mainFunc/showProjects',
			type: 'post',
			dataType: 'json',
			async: false,
			data: {
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
		$("#addModal").modal({
			backdrop: 'static',
		});
	});
	$(document).on('click', '#add', function (event) {
		$.ajax({
			url: url+'/user/addAdmin',
			type: 'post',
			dataType: 'json',
			data: {
				account: $('#ManagerAccountName').val(),
				projectName: $('#projectName').val(),
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
	let role_id;
	$(document).on('click', '.resetPwd', function (event) {
		role_id=$(this).attr('role_id');
		$.ajax({
			url: url+'/user/manageAdmin',
			type: 'post',
			dataType: "json",
			data: {
				account: role_id,
				type:"reset" ,
			},
			success: function (result) {
				if (result.code === 0) {
					swal(
						'密码重置成功!',
						result.message,
						'success'
					);
					// $("#delete-modal").modal("hide");
					//刷新表格
					$("#table").bootstrapTable('refresh');
				} else if (result.code === 1) {
					swal(
						'密码重置失败!',
						result.message,
						'error'
					);
				}
			},
			error: function () {
				swal(
					'密码重置失败!',
					'网络错误',
					'error'
				);
			}
		});
	});

	$(document).on('click', '.deleteButton', function (event) {
		let deletePrompt = $("#delete-prompt");
		//首先清空模态框的提示信息
		deletePrompt.empty();
		console.log($(this).attr('role_id'));
		role_id = $(this).attr('role_id');
		$("#delete-modal").modal({
			backdrop: 'static',
		});
		//回显需要删除的属性的名称
		roleName = $(this).parent().prev().prev().text();
		//提示信息
		deletePrompt.append("您是否要删除:" + roleName+"账号");

	});

	//删除模态框确认按钮绑定事件
	$(document).on('click', "#delete-confirm-button", function () {
		$.ajax({
			url: url+'/user/manageAdmin',
			type: 'post',
			dataType: "json",
			data: {
				account: role_id,
				type: "del",
			},
			success: function (result) {
				if (result.code === 0) {
					swal(
						'删除成功!',
						result.message,
						'success'
					);
					$("#delete-modal").modal("hide");
					//刷新表格
					$("#table").bootstrapTable('refresh');
				} else if (result.code === 1) {
					swal(
						'删除失败!',
						result.message,
						'error'
					);
				}
			},
			error: function () {
				swal(
					'删除失败!',
					'网络错误',
					'error'
				);
			}
		});
	});
})