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
      corpTypeArray=result.data
      console.log(result.data);
      $('#projectName').empty();
      $('#addProjectName').empty();
      $('#projectName').append("<option value=''>请选择</option>");
      $('#addProjectName').append("<option value=''>请选择</option>");
      $.each(result.data.list, function(index, item) {
        $('#projectName').append('<option  value='+item.name+'>'+item.name+'</option>');
        $('#addProjectName').append('<option  value='+item.name+'>'+item.name+'</option>');
      });
    }
  })
}else{
  $('#projectName').empty();
  $('#projectName').append('<option  value='+personProjectName+'>'+personProjectName+'</option>');
  $('#projectName').attr("disabled","true");
  $('#addProjectName').empty();
  $('#addProjectName').append('<option  value='+personProjectName+'>'+personProjectName+'</option>');
  $('#addProjectName').attr("disabled","true");
}

$.ajax({
  url: url+'/mainFunc'+'/getGroups',
  type: 'post',
  dataType: 'json',
  async:false,
  data: {
    projectName:$("#projectName").val(),
  },
  success:function(result){
    corpTypeArray=result.data
    console.log(result.data);
    $('#teamName').empty();
    $('#teamName').append("<option value=''>请选择</option>");
    $.each(result.data, function(index, item) {
     $('#teamName').append('<option value='+item.teamName+'>'+item.teamName+'</option>');
   });
  }
})

$.ajax({
  url: url+'/mainFunc'+'/getGroups',
  type: 'post',
  dataType: 'json',
  async:false,
  data: {
    projectName:$("#addProjectName").val(),
  },
  success:function(result){
    corpTypeArray=result.data
    console.log(result.data);
    $('#addTeamName').empty();
    $('#addTeamName').append("<option value=''>请选择</option>");
    $.each(result.data, function(index, item) {
     $('#addTeamName').append('<option value='+item.teamName+'>'+item.teamName+'</option>');
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
      corpTypeArray=result.data
      console.log(result.data);
      $('#teamName').empty();
      $('#teamName').append("<option value=''>请选择</option>");
      $.each(result.data, function(index, item) {
       $('#teamName').append('<option value='+item.teamName+'>'+item.teamName+'</option>');
     });
    }
  })
});
$(document).on('change', "#addProjectName", function () {
  $.ajax({
    url: url+'/mainFunc'+'/getGroups',
    type: 'post',
    dataType: 'json',
    async:false,
    data: {
      projectName:$("#addProjectName").val(),
    },
    success:function(result){
      corpTypeArray=result.data
      console.log(result.data);
      $('#addTeamName').empty();
      $('#addTeamName').append("<option value=''>请选择</option>");
      $.each(result.data, function(index, item) {
       $('#addTeamName').append('<option value='+item.teamName+'>'+item.teamName+'</option>');
     });
    }
  })
});
//获取工人信息数据
$(document).on('change', "#teamName", function () {
  $.ajax({
    url: url+'/mainFunc'+'/getWorks',
    type: 'post',
    dataType: 'json',
    async:false,
    data: {
      projectName:$('#projectName').val(),
      teamName:$('#teamName').val()
    },
    success:function(result){
      corpTypeArray=result.data
      console.log(result.data);
      $('#workerIdCardNumber').empty();
      $('#workerIdCardNumber').append("<option value=''>请选择</option>");
      $.each(result.data, function(index, item) {
       $('#workerIdCardNumber').append('<option value='+item.idCardNumber+'>'+item.workerName+'</option>');
     });
    }
  })

})
$(document).on('change', "#addTeamName", function () {
  $.ajax({
    url: url+'/mainFunc'+'/getWorks',
    type: 'post',
    dataType: 'json',
    async:false,
    data: {
      projectName:$('#addProjectName').val(),
      teamName:$('#addTeamName').val()
    },
    success:function(result){
      corpTypeArray=result.data
      console.log(result.data);
      $('#addWorkerIdCardNumber').empty();
      $('#addWorkerIdCardNumber').append("<option value=''>请选择</option>");
      $.each(result.data, function(index, item) {
       $('#addWorkerIdCardNumber').append('<option value='+item.idCardNumber+'>'+item.workerName+'</option>');
     });
    }
  })

})




//模糊查询
$(document).on('click', "#searchButton", function () {
  var projectName=$('#projectName').val();
  console.log(projectName);
  if(projectName!=""){
    $('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
      url:url+'/mainFunc'+'/showInOutInfo',
      method: 'post',
      pagination: true,
      search: false,
      dataType:'json',
      toolbar:'#toolbar',
      striped:true,
      pageSize:'15',
      pageList: [10, 25, 50, 100],
      showRefresh:false,
      dataField: 'data',
      contentType: "application/x-www-form-urlencoded",
      mobileResponsive:true,
      useRowAttrFunc: true,
      sidePagination:'server',
      pageNumber: 1,
      responseHandler:function(res){
        res.total=res.count;
        return res;
      },
      queryParams:function(params){
        return{
         limit:params.limit,
         page:(params.offset/params.limit)+1,
         projectName:projectName,
         teamName:$('#teamName').val(),
         idCardNumber:$('#workerIdCardNumber').val(),
         startDate:$('#startDate').val(),
         endDate:$('#endDate').val(),
         type:$('#type').val(),
       }
     },
     columns:[{
       field:'date',
       title:'日期',
       sortable:true,
     },{
      field:'projectName',
      title:'项目名称',
      sortable:true,
    },{
      field:'teamName',
      title:'班组名称',
      sortable:true,
    },{
      field: 'workerName',
      title: '工人姓名',
      sortable: true,
    },{
     field:'idCardNumber',
     title:'工人证件号',
     sortable:true,
   },{
    field:'isTeamLeader',
    title:'是否领导',
    formatter:function(value,row,index){
      if(row.isTeamLeader=="1"){
        return "是";
      }else if(row.isTeamLeader=="0"){
        return "否";
      }
    }
  },{
   field:'type',
   title:'进退场类型',
   sortable:true,
     // formatter:function (value,row,index){
     //  if(row.type=="1"){
     //    return "进场";
     //  }else if(row.type=="0"){
     //    return "退场";
     //  }
     // }
   },{
    field:'null',
    title:'操作',
    formatter:actionFormatter,
  }
  ]
});
  }else{
    swal(
      '添加失败!',
      '项目名必填',
      'warning'
      );
  }
});


 //渲染按钮
 function actionFormatter(value,row, index) {
  let id = row.id;
    // delete row.ability;
    let result = "";
    if(row.type=="进场"){
      if(row.isTeamLeader=="1"){
        result += "<button class='btn btn-xs btn-success exportTeamLeaderIn' row='"+JSON.stringify(row)+"' role_id="+id+" title='班组长进场承诺书'><span>班组长进场承诺书</span></button>";
      }
      result += "<button class='btn btn-xs btn-success exportWorkerIn' row='"+JSON.stringify(row)+"' role_id="+id+" title='工人进场承诺书'><span>工人进场承诺书</span></button>";
      result += "<button class='btn btn-xs btn-success exportInformed' row='"+JSON.stringify(row)+"' role_id="+id+" title='工人知情反馈承诺书'><span>工人知情反馈承诺书</span></button>";
    }else if(row.type=="退场"){
      if(row.isTeamLeader=="1"){
        result += "<button class='btn btn-xs btn-success exportTeamLeaderOut' row='"+JSON.stringify(row)+"' role_id="+id+" title='班组长退场承诺书'><span>班组长退场承诺书</span></button>";
        result += "<button class='btn btn-xs btn-success exportTeamWages' row='"+JSON.stringify(row)+"' role_id="+id+" title='班组工资结清确认书'><span>班组工资结清确认书</span></button>";
      }
      result += "<button class='btn btn-xs btn-success exportWorkerOut' row='"+JSON.stringify(row)+"' role_id="+id+" title='工人退场确认书'><span>工人退场确认书</span></button>";
      result += "<button class='btn btn-xs btn-success exportWageFinished' row='"+JSON.stringify(row)+"' role_id="+id+" title='工资结清确认书'><span>工资结清确认书</span></button>";
    }
    
    return result;
  }

  $(document).on('click', ".exportTeamWages", function () {
    var row=JSON.parse($(this).attr('row'))
    $.ajax({
      url: url+'/exportFunc'+'/exportTeamWages',
      type: 'post',
      dataType: 'json',
      async:false,
      data: {
        projectName:row.projectName,
        teamName:row.teamName,
        idCardNumber:row.idCardNumber,
        workerName:row.workerName,
      },
      success: function (result) {
        if (result.code === 0) {
          swal(
            '导出成功!',
            result.message,
            'success'
            );
          window.open(result.data.url);
        }else if (result.code===1){
          swal(
            '导出失败!',
            result.message,
            'error'
            );
        }
      }
    })
  })



  $(document).on('click', ".exportTeamLeaderOut", function () {
    var row=JSON.parse($(this).attr('row'))
    $.ajax({
      url: url+'/exportFunc'+'/exportTeamLeaderOut',
      type: 'post',
      dataType: 'json',
      async:false,
      data: {
        projectName:row.projectName,
        teamName:row.teamName,
        idCardNumber:row.idCardNumber,
        workerName:row.workerName,
      },
      success: function (result) {
        if (result.code === 0) {
          swal(
            '导出成功!',
            result.message,
            'success'
            );
          window.open(result.data.url);
        }else if (result.code===1){
          swal(
            '导出失败!',
            result.message,
            'error'
            );
        }
      }
    })
  })



  $(document).on('click', ".exportWageFinished", function () {
    var row=JSON.parse($(this).attr('row'))
    $.ajax({
      url: url+'/exportFunc'+'/exportWageFinished',
      type: 'post',
      dataType: 'json',
      async:false,
      data: {
        projectName:row.projectName,
        teamName:row.teamName,
        idCardNumber:row.idCardNumber,
        workerName:row.workerName,
      },
      success: function (result) {
        if (result.code === 0) {
          swal(
            '导出成功!',
            result.message,
            'success'
            );
          window.open(result.data.url);
        }else if (result.code===1){
          swal(
            '导出失败!',
            result.message,
            'error'
            );
        }
      }
    })
  })




  $(document).on('click', ".exportWorkerOut", function () {
    var row=JSON.parse($(this).attr('row'))
    $.ajax({
      url: url+'/exportFunc'+'/exportWorkerOut',
      type: 'post',
      dataType: 'json',
      async:false,
      data: {
        projectName:row.projectName,
        teamName:row.teamName,
        idCardNumber:row.idCardNumber,
        workerName:row.workerName,
      },
      success: function (result) {
        if (result.code === 0) {
          swal(
            '导出成功!',
            result.message,
            'success'
            );
          window.open(result.data.url);
        }else if (result.code===1){
          swal(
            '导出失败!',
            result.message,
            'error'
            );
        }
      }
    })
  })


  $(document).on('click', ".exportWorkerIn", function () {
    var row=JSON.parse($(this).attr('row'))
    $.ajax({
      url: url+'/exportFunc'+'/exportWorkerIn',
      type: 'post',
      dataType: 'json',
      async:false,
      data: {
        projectName:row.projectName,
        teamName:row.teamName,
        idCardNumber:row.idCardNumber,
        workerName:row.workerName,
      },
      success: function (result) {
        if (result.code === 0) {
          swal(
            '导出成功!',
            result.message,
            'success'
            );
          window.open(result.data.url);
        }else if (result.code===1){
          swal(
            '导出失败!',
            result.message,
            'error'
            );
        }
      }
    })
  })

  $(document).on('click', ".exportTeamLeaderIn", function () {
    var row=JSON.parse($(this).attr('row'))
    $.ajax({
      url: url+'/exportFunc'+'/exportTeamLeaderIn',
      type: 'post',
      dataType: 'json',
      async:false,
      data: {
        projectName:row.projectName,
        teamName:row.teamName,
        idCardNumber:row.idCardNumber,
        workerName:row.workerName,
      },
      success: function (result) {
        if (result.code === 0) {
          swal(
            '导出成功!',
            result.message,
            'success'
            );
          window.open(result.data.url);
        }else if (result.code===1){
          swal(
            '导出失败!',
            result.message,
            'error'
            );
        }
      }
    })
  })

  $(document).on('click', ".exportInformed", function () {
    var row=JSON.parse($(this).attr('row'))
    $.ajax({
      url: url+'/exportFunc'+'/exportInformed',
      type: 'post',
      dataType: 'json',
      async:false,
      data: {
        projectName:row.projectName,
        teamName:row.teamName,
        idCardNumber:row.idCardNumber,
        workerName:row.workerName,
      },
      success: function (result) {
        if (result.code === 0) {
          swal(
            '导出成功!',
            result.message,
            'success'
            );
          window.open(result.data.url);
        }else if (result.code===1){
          swal(
            '导出失败!',
            result.message,
            'error'
            );
        }
      }
    })
  })
  


//添加
$(document).on('click', "#add-a", function () {
  // $('#addProjectName').val("");
  $('#addTeamName').val("");
  $('#addWorkerIdCardNumber').val("");
  $('#addDate').val("");
  $("input[name='addType']:checked").val("");
  $("#addModal").modal({
    backdrop: 'static'
  });
});
//添加
$(document).on('click', "#submit", function () {
  var projectName=$('#addProjectName').val();
  var teamName=$('#addTeamName').val();
  var workerIdCardNumber=$('#addWorkerIdCardNumber').val();
  var date=$('#addDate').val();
  $.ajax({
    url: url+'/mainFunc'+'/addInOutInfo',
    type: 'post',
    dataType: 'json',
    async:false,
    data: {
      projectName:projectName,
      teamName:teamName,
      idCardNumber:workerIdCardNumber,
      date:date,
      type:"0",
    },
    success: function (result) {
      if (result.code === 0) {
        swal(
          '添加成功!',
          result.message,
          'success'
          );
        $("#table").bootstrapTable('refresh');
        $("#addModal").modal('hide');
      }else if (result.code===1){
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
    }
  })
});


})