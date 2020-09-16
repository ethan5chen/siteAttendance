// laydate.render({
// 	elem: '#signIn_time'
// 	, type: 'time'
// 	,format: 'HH:mm'
// });
// laydate.render({
// 	elem: '#signOut_time'
// 	, type: 'time'
// 	,format: 'HH:mm'
// });

$(function () {
	$('table').bootstrapTable({
		url: url + '/mainFunc/showProjects',
		method: 'post',
		pagination: true,
		dataType: 'json',
		toolbar: '#toolbar',
		striped: true,
		limit: '15',
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
				limit: params.limit,
				page: (params.offset / params.limit) + 1,
			}
		},
		columns: [{
			field: 'name',
			title: '项目名称',
			sortable: true,
		}, {
			field: 'entryTime',
			title: '进场时间',
			sortable: true,
		}, {
			field: 'exitTime',
			title: '退场时间',
			sortable: true,
		}, {
			field: 'punched',
			title: '状态',
			formatter:function (value, row, index){
				if(row.punched=="1"){
					return "打开";
				}else{
					return "关闭";
				}
			}
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
		console.log(row);
		result += "<button class='btn btn-xs btn-success setStatusButton'  row='" + JSON.stringify(row) + "' role_id=" + id + " title='状态设置'><span>状态设置</span></button>";
		result += "<button class='btn btn-xs btn-primary setWorkerButton'  row='" + JSON.stringify(row) + "' role_id=" + id + " title='工人设置'><span>工人设置</span></button>";
		// result += "<button class='btn btn-xs btn-primary editButton' row='" + JSON.stringify(row) + "' role_id=" + id + " title='修改'><span>修改</span></button>";
		return result;
	}

	//
	$(document).on('click', '.setStatusButton', function (event) {
		$('.project1').val("");
		$('#signIn_time').val("");
		$('#signOut_time').val("");
		let row = $(this).attr('row');
		row = $.parseJSON(row);
		id = row.id;
		$('.project1').val(row.name);
		// $('#status').val(row.punched);
		$('input[name="status"][value="' + row.punched + '"]').attr("checked", true);
		$('#signIn_time').val(row.entryTime);
		$('#signOut_time').val(row.exitTime);
		$("#setStatusModal").modal({
			backdrop: 'static',
		});
	});

	$(document).on('click', '#setStatusConfirm', function (event) {
		$.ajax({
			url: url + '/otherFunc/setGroupAuto',
			type: 'post',
			dataType: 'json',
			data: {
				projectName: $('.project1').val(),
				punched: $("input[name='status']:checked").val(),
				entryTime: $('#signIn_time').val(),
				exitTime: $('#signOut_time').val(),
			},
			success: function (result) {
				console.log(result);
				if (result.code === 0) {
					swal(
						'设置成功!',
						result.message,
						'success'
					);
					$("#setStatusModal").modal("hide");
					$("#table").bootstrapTable('refresh');
				} else if (result.code === 1) {
					swal(
						'设置失败!',
						result.message,
						'error'
					);
				}
			},
			error: function () {
				swal(
					'设置失败!',
					'网络错误',
					'error'
				);
			},
		});
	});

	//delete
	let roleName;
	let role_id;
	var row;
	var worker_str = "";
	$(document).on('click', '.setWorkerButton', function (event) {

		// $('#project').val("");
		$('#team').val("");
		$("#worker").empty();
		$('#selected_selection').empty();

		row = $.parseJSON($(this).attr('row'));
		id = row.id;
		$('#project2').val(row.name);
		console.log(row.name);
		//获取所有班组
		$.ajax({
			url: url + '/mainFunc/getGroups',
			type: 'post',
			dataType: 'json',
			async: false,
			data: {
				projectName: $('#project2').val(),
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
		$("#team").change(function () {
			$("#worker").empty();
			$("#selected_selection").empty();
			//获取所有人员
			$.ajax({
				url: url + '/mainFunc/getWorks',
				type: 'post',
				dataType: 'json',
				async: false,
				data: {
					projectName: $('#project2').val(),
					teamName: $('#team').val(),
				},
				success: function (result) {
					console.log(result);
					$('#worker').empty();
					$.each(result.data, function (index, item) {
						$('#worker').append('<option value=' + item.workerName + ":" + item.idCardNumber + '>' + item.workerName+ ' ' + item.idCardNumber + '</option>');
					});
				}
			});
		});
		$("#setWorkerModal").modal({
			backdrop: 'static',
		});
	});

	$(document).on('click', '#right_shift', function (event) {
		// $('#selected_selection').empty();
		var worker = $('#worker').val();     //$('#worker').val()有冒号
		// var worker = $("#worker").find("option:selected").val();
		console.log(worker);
		console.log($("#worker").find("option:selected").val());
		$.each(worker, function (index, item) {    //item为工人姓名加身份证号
			var worker_id = item.split(":")[1];
			if (index != 0)
				worker_str += ',';
			worker_str += worker_id;
			console.log(item);
			console.log(worker_id);
			$('#selected_selection').append('<option value=' + worker_id + '>' + item + '</option>');
		});
	});

	//清空
	$(document).on('click', '#left_shift', function (event) {
		$('#selected_selection').empty();
		worker_str = "";
	});

	//关闭模态框确认按钮绑定事件
	$(document).on('click', "#setWorker-confirm", function () {
		console.log(row)
		$.ajax({
			url: url + '/otherFunc/setWorkerAuto',
			type: 'post',
			dataType: "json",
			data: {
				projectName:row.name,
				teamName:$('#team').val(),
				workers: worker_str,
			},
			success: function (result) {
				if (result.code === 0) {
					swal(
						'设置成功!',
						result.message,
						'success'
					);
					$("#setWorkerModal").modal("hide");
					//刷新表格
					$("#table").bootstrapTable('refresh');
				} else if (result.code === 1) {
					swal(
						'设置失败!',
						result.message,
						'error'
					);
				}
			},
			error: function () {
				swal(
					'设置失败!',
					'网络错误',
					'error'
				);
			}
		});
	});

})