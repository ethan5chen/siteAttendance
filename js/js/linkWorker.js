$(function () {
	var person=sessionStorage.getItem('username')
	var personProjectName=sessionStorage.getItem('productName')
	var personProjectCode=sessionStorage.getItem('productCode')

	//获取项目数据
	if(person=="admin"){
		$.ajax({
			url: url+'/mainFunc'+'/getProjects',
			type: 'post',
			dataType: 'json',
			async:false,
			data: {},
			success:function(result){
				console.log(result.data);
				$('#projectName').empty();
				$('#projectName').append("<option value=''>请选择</option>");
				$.each(result.data.list, function(index, item) {
					$('#projectName').append('<option  value='+item.name+'>'+item.name+'</option>');
				});
			}
		})
	}else{
		$('#projectName').empty();
		$('#projectName').append('<option  value='+personProjectName+'>'+personProjectName+'</option>');
		$('#projectName').attr("disabled","true");
	}


    //获取班组数据
    $.ajax({
    	url: url+'/mainFunc'+'/getGroups',
    	type: 'post',
    	dataType: 'json',
    	async:false,
    	data: {
    		projectName:$("#projectName").val(),
    	},
    	success:function(result){
    		console.log(result.data);
    		$('#teamName').empty();
    		$('#teamName').append("<option value=''>请选择</option>");
    		$.each(result.data, function(index, item) {
    			$('#teamName').append('<option value='+item.teamName+'>'+item.teamName+'</option>');
    		});
    	}
    })
	//下拉框联动
	$(document).on('change', "#projectName", function () {
		$.ajax({
			url: url+'/mainFunc'+'/getGroups',
			type: 'post',
			dataType: 'json',
			async:false,
			data: {
				projectName:$("#projectName").val(),
			},
			success:function(result){
				console.log(result.data);
				$('#teamName').empty();
				$('#teamName').append("<option value=''>请选择</option>");
				$.each(result.data, function(index, item) {
					$('#teamName').append('<option value='+item.teamName+'>'+item.teamName+'</option>');
				});
			}
		})
	});

	$('#table').bootstrapTable({
		url: url + '/otherFunc/showWorkerLinks',
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
				projectName: $("#projectName").val(),
				teamName: $("#teamName").val(),
				workerName: $("#workName").val(),
			}
		},
		columns: [{
			field: 'workerName',
			title: '姓名',
			sortable: true,
		}, {
			field: 'idCardNumber',
			title: '证件号码',
			sortable: true,
		}, {
			field: 'gender',
			title: '性别',
			sortable: true,
		}, {
			field: 'workTypeName',
			title: '当前工种',
			sortable: true,
		}, {
			field: 'workRoleName',
			title: '工人类型',
			sortable: true,
		}, {
			field: 'linkIdcard',
			title: '关联身份证',
			sortable: true,
		}, {
			field: 'linkWorkerName',
			title: '关联工人姓名',
			sortable: true,
		}, {
			field: 'null',
			title: '操作',
			formatter: actionFormatter,
		}]
	});

	//模糊搜索
	$(document).on('click', "#searchButton", function () {
		$('#table').bootstrapTable('destroy')
		$('#table').bootstrapTable({
			url: url + '/otherFunc/showWorkerLinks',
			method: 'post',
			pagination: true,
			search: false,
			dataType: 'json',
			toolbar: '#toolbar',
			striped: true,
			pageSize: '15',
			pageList: [10, 25, 50, 100],
			showRefresh: false,
			dataField: "data",
			contentType: "application/x-www-form-urlencoded",
			mobileResponsive: true,
			useRowAttrFunc: true,
			sidePagination: 'server',
			pageNumber: 1,
			//显示总记录条数
			responseHandler: function (res) {
				res.total = res.count;
				return res;
			},
			queryParams: function (params) {
				return {
					limit: params.limit,
					page: (params.offset / params.limit) + 1,
					projectName: $("#projectName").val(),
					teamName: $("#teamName").val(),
					workerName: $("#workName").val(),
				}
			},
			columns: [{
				field: 'workerName',
				title: '姓名',
				sortable: true,
			}, {
				field: 'idCardNumber',
				title: '证件号码',
				sortable: true,
			}, {
				field: 'gender',
				title: '性别',
				sortable: true,
			}, {
				field: 'workTypeName',
				title: '当前工种',
				sortable: true,
			}, {
				field: 'workRoleName',
				title: '工人类型',
				sortable: true,
			}, {
				field: 'linkIdcard',
				title: '关联身份证',
				sortable: true,
			}, {
				field: 'linkWorkerName',
				title: '关联工人姓名',
				sortable: true,
			}, {
				field: 'null',
				title: '操作',
				formatter: actionFormatter,
			}]
		});
		$("#search-input").val("");
	});
	//渲染按钮
	function actionFormatter(value, row, index) {
		let id = row.id;
		let result = "";
		result += "<button class='btn btn-xs btn-primary setLink' row='" + JSON.stringify(row) + "' role_id=" + id + " title='设置关联'><span>设置关联</span></button>";
		return result;
	}
	var idCardNumber;
	//设置关联模态框
	let row;
	$(document).on('click', ".setLink", function () {
		row = $.parseJSON($(this).attr('row'));
		idCardNumber = row.idCardNumber;
		var teamName = row.teamName;

		//获取同一个班组的工人证件号列表
		$.ajax({
			url: url + '/mainFunc/getWorks',
			type: 'post',
			dataType: "json",
			data: {
				projectName: $("#projectName").val(),
				teamName: $("#teamName").val(),
			},
			success: function (result) {
				$('#worker').empty();
				$.each(result.data, function (index, item) {
					$('#worker').append('<option value=' + item.idCardNumber + '>' + item.workerName +'    '+item.idCardNumber+ '</option>');
				});
			},
			error: function () {
				swal(
					'设置失败!',
					'网络错误',
					'error'
					);
			}
		});
		$("#setLinkModal").modal({
			backdrop: 'static',
		});

	});

	$(document).on('click', "#setLink-confirm", function () {
		$.ajax({
			url: url + '/otherFunc/setLinks',
			type: 'post',
			dataType: "json",
			data: {
				projectName:$("#projectName").val(),
				teamName:$("#teamName").val(),
				trueIdcard: idCardNumber,
				linkIdCard: $('#worker').val(),
			},
			success: function (result) {
				if (result.code === 0) {
					swal(
						'设置成功!',
						result.message,
						'success'
						);
					$("#setLinkModal").modal("hide");
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
});




