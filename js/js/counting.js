$(function () {
	var person = sessionStorage.getItem('username');
	var productCode = sessionStorage.getItem('productCode');
	var productName = sessionStorage.getItem('productName');
	if(person=="admin"){
		$('table').bootstrapTable({
			url: url + '/otherFunc/showPreCount',
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
				field: 'date',
				title: '日期',
				sortable: true,
			}, {
				field: 'workerName',
				title: '工人姓名',
				sortable: true,
			}, {
				field: 'idcard',
				title: '证件号',
				sortable: true,
			}, {
				field: 'name',
				title: '名称',
				sortable: true,
			}, {
				field: 'price',
				title: '单价',
				sortable: true,
			}, {
				field: 'amount',
				title: '数量',
				sortable: true,
			}, {
				field: 'allCount',
				title: '小计',
				sortable: true,
			}
			// , {
			// 	field: 'null',
			// 	title: '操作',
			// 	formatter: actionFormatter,
			// }
			]
		});
	}else{
		$('table').bootstrapTable({
		url: url + '/otherFunc/showProjectPreCount',
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
				projectName:productName,
			}
		},
		columns: [{
			field: 'date',
			title: '日期',
			sortable: true,
		}, {
			field: 'workerName',
			title: '工人姓名',
			sortable: true,
		}, {
			field: 'idcard',
			title: '证件号',
			sortable: true,
		}, {
			field: 'name',
			title: '名称',
			sortable: true,
		}, {
			field: 'price',
			title: '单价',
			sortable: true,
		}, {
			field: 'amount',
			title: '数量',
			sortable: true,
		}, {
			field: 'allCount',
			title: '小计',
			sortable: true,
		}
			// , {
			// 	field: 'null',
			// 	title: '操作',
			// 	formatter: actionFormatter,
			// }
		]
	});
	}
	
	//渲染按钮
	function actionFormatter(value, row, index) {
		let id = row.id;
		// delete row.ability;
		console.log(JSON.stringify(row));
		let result = "";
		result += "<button class='btn btn-xs btn-primary editButton' row='" + JSON.stringify(row) + "' role_id=" + id + " title='修改'><span>修改</span></button>";
		result += "<button class='btn btn-xs btn-danger deleteButton'  role_id=" + id + " title='删除'><span>删除</span></button>";
		return result;
	}

	$(document).on('click', '#add-a', function (event) {
		$('#date').val("");
		$('#name').val("");
		$('#amount').val("");
		$('#price').val("");
		$('#project').val();
		$('#team').val();
		$('#worker').val();
		$("#addModal").modal({
			backdrop: 'static',
		});
		if (person == "admin") {    //管理员则获取所有项目
			$('#projectName').remove();
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
						$('#team').append('<option value="请选择">请选择</option>');
						$.each(result.data, function (index, item) {
							$('#team').append('<option value=' + item.teamName + '>' + item.teamName + '</option>');
						});
					}
				});
			});
		}
		else {  //普通管理员则回显其对应的项目
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
		$("#team").change(function () {
			$("#worker").empty();
			//获取所有人员
			$.ajax({
				url: url + '/mainFunc/getWorks',
				type: 'post',
				dataType: 'json',
				async: false,
				data: {
					projectName: $('#project').val(),
					teamName: $('#team').val(),
				},
				success: function (result) {
					console.log(result);
					$('#worker').empty();
					$.each(result.data, function (index, item) {

						$('#worker').append('<option value=' + item.idCardNumber + '>' + item.workerName + '</option>');
					});
				}
			});
		});
	});
	$(document).on('click', '#add', function (event) {
		if ($('#date').val() == "请选择" || $('#name').val() == "请选择" || $('#amount').val() == "请选择" || $('#price').val() == "请选择" || $('#project').val() == "请选择" || $('#team').val() == null || $('#date').val() == "") {
			alert("请录入完整信息");
			return;
		}
		if (person == "admin") {
			productName = $('#project').val();
		}
		$.ajax({
			url: url + '/otherFunc/addPreCount',
			type: 'post',
			dataType: 'json',
			data: {
				date: $('#date').val(),
				name: $('#name').val(),
				amount: $('#amount').val(),
				price: $('#price').val(),
				projectName: productName,
				teamName: $('#team').val(),
				idcard: $('#worker').val(),
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
})

//
// $(document).on('click', '.editButton', function (event) {
// 		let row = $(this).attr('row');
// 		row = $.parseJSON(row);
// 		console.log(row);
// 		row_id = row.id;
// 		//获取所有班组
// 		$.ajax({
// 			url: url + '/otherFunc/showPreCount',
// 			type: 'post',
// 			dataType: 'json',
// 			async: false,
// 			data: {
// 				method: "getTeamInfo",
// 				limit: "0",
// 				page: "0",
// 			},
// 			success: function (result) {
// 				console.log(result);
// 				$('#update_team').empty();
// 				$.each(result.data, function (index, item) {
// 					$('#update_team').append('<option value=' + item.teamName + '>' + item.teamName + '</option>');
// 				});
// 			}
// 		});
// 		//获取所有人员
// 		$.ajax({
// 			url: url + '/otherFunc/showPreCount',
// 			type: 'post',
// 			dataType: 'json',
// 			async: false,
// 			data: {
// 				method: "getAllWorkerInfo",
// 				limit: "0",
// 				page: "0",
// 			},
// 			success: function (result) {
// 				console.log(result);
// 				$('#update_worker').empty();
// 				$.each(result.data, function (index, item) {
// 					$('#update_worker').append('<option value=' + item.workerName + '>' + item.workerName + '</option>');
// 				});
// 			}
// 		});
// 		$('#update_date').val(row.date);
// 		$('#update_name').val(row.name);
// 		$('#update_amount').val(row.amount);
// 		$('#update_unitPrice').val(row.unitPrice);
// 		// $('#update_team').text(row.teamName);
// 		$('#update_team').val(row.teamName);
// 		$('#update_worker').val(row.workerName);
// 		$("#updateModal").modal({
// 			backdrop: 'static',
// 		});
// 	});
// 	//update
// 	$(document).on('click', '#update', function (event) {
// 		$.ajax({
// 			url: url + '/otherFunc/showPreCount',
// 			type: 'post',
// 			dataType: 'json',
// 			data: {
// 				method: "updateCounting",
// 				id: row_id,
// 				date: $('#update_date').val(),
// 				name: $('#update_name').val(),
// 				amount: $('#update_amount').val(),
// 				unitPrice: $('#update_unitPrice').val(),
// 				teamName: $('#update_team').val(),
// 				workerName: $('#update_worker').val(),
// 			},
// 			success: function (result) {
// 				console.log(result);
// 				if (result.code === 0) {
// 					swal(
// 						'修改成功!',
// 						result.message,
// 						'success'
// 					);
// 					$("#updateModal").modal("hide");
// 					$("#table").bootstrapTable('refresh');
// 				} else if (result.code === 1) {
// 					swal(
// 						'修改失败!',
// 						result.message,
// 						'error'
// 					);
// 				}
// 			},
// 			error: function () {
// 				swal(
// 					'修改失败!',
// 					'网络错误',
// 					'error'
// 				);
// 			}
// 		})

// 	});

// 	let roleName;
// 	let role_id;
// 	$(document).on('click', '.deleteButton', function (event) {
// 		let deletePrompt = $("#delete-prompt");
// 		//首先清空模态框的提示信息
// 		deletePrompt.empty();
// 		console.log($(this).attr('role_id'));
// 		role_id = $(this).attr('role_id');
// 		$("#delete-modal").modal({
// 			backdrop: 'static',
// 		});
// 		//回显需要删除的属性的名称
// 		roleName = $(this).parent().prev().prev().prev().text();
// 		//提示信息
// 		deletePrompt.append("您是否要删除:" + roleName);

// 	});

// 	//删除模态框确认按钮绑定事件
// 	$(document).on('click', "#delete-confirm-button", function () {
// 		$.ajax({
// 			url: url + '/otherFunc/showPreCount',
// 			dataType: "json",
// 			data: {
// 				method: "deleteCounting",
// 				id: role_id,
// 			},
// 			success: function (result) {
// 				if (result.code === 0) {
// 					swal(
// 						'删除成功!',
// 						result.message,
// 						'success'
// 					);
// 					$("#delete-modal").modal("hide");
// 					//刷新表格
// 					$("#table").bootstrapTable('refresh');
// 				} else if (result.code === 1) {
// 					swal(
// 						'删除失败!',
// 						result.message,
// 						'error'
// 					);
// 				}
// 			},
// 			error: function () {
// 				swal(
// 					'删除失败!',
// 					'网络错误',
// 					'error'
// 				);
// 			}
// 		});
// 	});