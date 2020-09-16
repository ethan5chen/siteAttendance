$(function () {
  var person=sessionStorage.getItem('username')
  var personProjectName=sessionStorage.getItem('productName')
  var personProjectCode=sessionStorage.getItem('productCode')
  console.log(person);
  console.log(personProjectName);
  console.log(personProjectCode);
//获取项目列表
if(person=="admin"){
  $.ajax({
    url: url+'/mainFunc'+'/getProjects',
    type: 'post',
    dataType: 'json',
    data: {
    },
    success:function(result){
      $('#projectName').empty();
      $('#upProjectName').empty();
      $('#projectName').append("<option value=''>请选择</option>");
      $('#upProjectName').append("<option value=''>请选择</option>");
      $.each(result.data.list, function(index, item) {
        $('#projectName').append('<option  value='+item.projectCode+'>'+item.name+'</option>');
        $('#upProjectName').append('<option  value='+item.projectCode+'>'+item.name+'</option>');
      });
    }
  })
}else{
  $('#projectName').empty();
  $('#projectName').append('<option  value>'+personProjectName+'</option>');
  $('#projectName').attr("disabled","true");
  $('#upProjectName').empty();
  $('#upProjectName').append('<option  value>'+personProjectName+'</option>');
  $('#upProjectName').attr("disabled","true");
}



$.ajax({
    url: url+'/mainFunc'+'/getContractors',
    type: 'post',
    dataType: 'json',
    async:false,
    data: {
      projectName:person=="admin"?$('#projectName').find("option:selected").text():personProjectName,
    },
    success:function(result){
      console.log(result.data);
      $('#corpCode').empty();
      $('#corpCode').append("<option value=''>请选择</option>");
      $.each(result.data.list, function(index, item) {
       $('#corpCode').append('<option value='+item.corpCode+'>'+item.corpName+'</option>');
     });
    }
  })

//获取企业数据
$(document).on('change', "#projectName", function () {
  $.ajax({
    url: url+'/mainFunc'+'/getContractors',
    type: 'post',
    dataType: 'json',
    async:false,
    data: {
      projectName:person=="admin"?$('#projectName').find("option:selected").text():personProjectName,
    },
    success:function(result){
      console.log(result.data);
      $('#corpCode').empty();
      $('#corpCode').append("<option value=''>请选择</option>");
      $.each(result.data.list, function(index, item) {
       $('#corpCode').append('<option value='+item.corpCode+'>'+item.corpName+'</option>');
     });
    }
  })
})




  //实例化表格
  if(person=="admin"){
    $('#table').bootstrapTable({
      url:url+'/mainFunc'+'/showGroups',
      method: 'post',
      pagination: true,
      search: false,
      dataType:'json',
      toolbar:'#toolbar',
      striped:true,
      pageSize:'15',
      pageList: [10, 25, 50, 100],
      showRefresh:false,
      dataField: "data",
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
        }
      },
      columns:[{
        field: 'teamSysNo',
        title: '班组编号',
        sortable: true,
      },{
        field:'teamName',
        title:'班组名称',
        sortable:true,
      },{
        field:'projectName',
        title:'项目名称',
        sortable:true,
      },{
        field:'corpName',
        title:'企业名称',
        sortable:true,
      },{
        field:'null',
        title:'操作',
        formatter:actionFormatter,
      }
      ]
    });

  }else{
    $('#table').bootstrapTable({
      url:url+'/mainFunc'+'/showProjectGroups',
      method: 'post',
      pagination: true,
      search: false,
      dataType:'json',
      toolbar:'#toolbar',
      striped:true,
      pageSize:'15',
      pageList: [10, 25, 50, 100],
      showRefresh:false,
      dataField: "data",
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
          projectName:personProjectName,
        }
      },
      columns:[{
        field: 'teamSysNo',
        title: '班组编号',
        sortable: true,
      },{
        field:'teamName',
        title:'班组名称',
        sortable:true,
      },{
        field:'projectName',
        title:'项目名称',
        sortable:true,
      },{
        field:'corpName',
        title:'企业名称',
        sortable:true,
      },{
        field:'null',
        title:'操作',
        formatter:actionFormatter,
      }
      ]
    });


  }
  $('#table').bootstrapTable({
    url:url+'/mainFunc'+'/getGroups',
    method: 'post',
    pagination: true,
    search: false,
    dataType:'json',
    toolbar:'#toolbar',
    striped:true,
    pageSize:'15',
    pageList: [10, 25, 50, 100],
    showRefresh:false,
    dataField: "data",
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
      }
    },
    columns:[{
      field: 'teamSysNo',
      title: '班组编号',
      sortable: true,
    },{
      field:'teamName',
      title:'班组名称',
      sortable:true,
    },{
      field:'projectName',
      title:'项目名称',
      sortable:true,
    },{
      field:'corpName',
      title:'企业名称',
      sortable:true,
    },{
      field:'null',
      title:'操作',
      formatter:actionFormatter,
    }
    ]
  });

  //渲染按钮
  function actionFormatter(value,row, index) {
    let id = row.id;
    // delete row.ability;
    let result = "";
    if(row.teamSysNo==""||row.teamSysNo==null){
      result += "<button class='btn btn-xs btn-primary editButton' row='"+JSON.stringify(row)+"' role_id="+id+" title='查询'><span>查询</span></button>";
    }
    if(row.requestSerialCode==""||row.requestSerialCode==null){
      result += "<button class='btn btn-xs btn-primary uploadButton' row='"+JSON.stringify(row)+"' role_id="+id+" title='上传'><span>上传</span></button>";
    }
    return result;
  }
//上传
$(document).on('click', ".uploadButton", function () {
  var row=$(this).attr('row');
  row=JSON.parse(row);
  console.log(row)
  $("#entryTime").val("");
  $('#exitTime').val("");

  $('#upProjectName').val(row.projectCode);
  
  
  $.ajax({
    url: url+'/mainFunc'+'/getContractors',
    type: 'post',
    dataType: 'json',
    async:false,
    data: {
      projectName:row.projectName,
    },
    success:function(result){
      console.log(result.data);
      $('#upCorpCode').empty();
      $('#upCorpCode').append("<option value=''>请选择</option>");
      $.each(result.data.list, function(index, item) {
       $('#upCorpCode').append('<option value='+item.corpCode+'>'+item.corpName+'</option>');
     });
    }
  })

  $('#upCorpCode').val(row.corpCode);
  $('#upTeamName').val(row.teamName);

  $("#uploadModal").modal({
    backdrop: 'static'
  });
});

//提交添加信息
$(document).on('click', "#upload_submit", function () {
  var fd = new FormData();
  var projectName="";
  var projectCode="";
  if(person=="admin"){
    projectName=$('#upProjectName').find("option:selected").text();
    projectCode=$('#upProjectName').val();
  }else{
    projectName=personProjectName;
    projectCode=personProjectCode;
  }
  
  var corpName=$('#upCorpCode').find("option:selected").text();
  var corpCode=$('#upCorpCode').val();
  var teamName=$("#upTeamName").val();
  var entryTime=$("#entryTime").val();
  var exitTime=$('#exitTime').val();
  // var entryAttachments=$("#entryAttachments").get(0).files[0];
  // var exitAttachments=$("#exitAttachments").get(0).files[0];
  fd.append("projectName", projectName);
  fd.append("projectCode", projectCode);
  fd.append("corpName", corpName);
  fd.append("corpCode", corpCode);
  fd.append("teamName", teamName);
  fd.append("entryTime", entryTime);
  fd.append("exitTime", exitTime);
  // if(entryAttachments!=""&&entryAttachments!=undefined&&entryAttachments!=null){
  //   fd.append("entryAttachments", entryAttachments);
  // }
  // if(exitAttachments!=""&&exitAttachments!=undefined&&exitAttachments!=null){
  //   fd.append("exitAttachments", exitAttachments);
  // }
  
  console.log(fd);
  if(projectName!=""&&corpName!=""&&teamName!=""){
    $.ajax({
      url: url+'/mainFunc'+'/uploadGroups',
      type: 'post',
      dataType: 'json',
      data: fd,
      processData: false,
      contentType: false,
      async:false,
      success: function (result) {
        if (result.code === 0) {
          swal(
            '上传成功!',
            result.message,
            'success'
            );
          $("#table").bootstrapTable('refresh');
          $("#uploadModal").modal('hide');
        }else if (result.code===1){
          swal(
            '上传失败!',
            result.message,
            'error'
            );
        }
      },
      error: function () {
        swal(
          '上传失败!',
          '网络错误',
          'error'
          );
      }
    })
  }else{
    swal(
      '添加失败!',
      '请输入数据',
      'warning'
      );
  }
});


//查询
$(document).on('click', ".editButton", function () {
  var row=$(this).attr('row');
  row=JSON.parse(row);
  // console.log(row);
  var projectName=row.projectName;
  var teamName=row.teamName;
  $.ajax({
    url: url+'/mainFunc'+'/upGroups',
    type: 'post',
    dataType: 'json',
    async:false,
    data: {
      projectName:projectName,
      teamName:teamName,
    },
    success: function (result) {
      if (result.code === 0) {
        swal(
          '上传成功!',
          result.message,
          'success'
          );
        $("#table").bootstrapTable('refresh');
      }else if (result.code===1){
        swal(
          '上传失败!',
          result.message,
          'error'
          );
      }
    },
    error: function () {
      swal(
        '上传失败!',
        '网络错误',
        'error'
        );
    }
  })
});

//添加
$(document).on('click', "#add-a", function () {
  $('#projectName').val("");
  $('#corpName').val("");
  $('#corpCode').val("");
  $('#teamName').val("");
  $('#entryTime').val("");
  $('#exitTime').val("");
  $("#addModal").modal({
    backdrop: 'static'
  });
});
//提交添加信息
$(document).on('click', "#submit", function () {
  var fd = new FormData();
  var projectName="";
  var projectCode="";
  if(person=="admin"){
    projectName=$('#projectName').find("option:selected").text();
    projectCode=$('#projectName').val();
  }else{
    projectName=personProjectName;
    projectCode=personProjectCode;
  }
  
  var corpName=$('#corpCode').find("option:selected").text();
  var corpCode=$('#corpCode').val();
  var teamName=$("#teamName").val();
  var entryTime=$("#entryTime").val();
  var exitTime=$('#exitTime').val();
  // var entryAttachments=$("#entryAttachments").get(0).files[0];
  // var exitAttachments=$("#exitAttachments").get(0).files[0];
  fd.append("projectName", projectName);
  fd.append("projectCode", projectCode);
  fd.append("corpName", corpName);
  fd.append("corpCode", corpCode);
  fd.append("teamName", teamName);
  fd.append("entryTime", entryTime);
  fd.append("exitTime", exitTime);
  // if(entryAttachments!=""&&entryAttachments!=undefined&&entryAttachments!=null){
  //   fd.append("entryAttachments", entryAttachments);
  // }
  // if(exitAttachments!=""&&exitAttachments!=undefined&&exitAttachments!=null){
  //   fd.append("exitAttachments", exitAttachments);
  // }
  
  console.log(fd);
  if(projectName!=""&&corpName!=""&&teamName!=""){
    $.ajax({
      url: url+'/mainFunc'+'/addGroups',
      type: 'post',
      dataType: 'json',
      data: fd,
      processData: false,
      contentType: false,
      async:false,
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
  }else{
    swal(
      '添加失败!',
      '请输入数据',
      'warning'
      );
  }
});



})