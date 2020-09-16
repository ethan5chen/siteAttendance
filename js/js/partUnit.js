$(function () {
  var person=sessionStorage.getItem('username')
  var personProjectName=sessionStorage.getItem('productName')
  console.log(person);
  console.log(personProjectName);
  //获取项目列表
  if(person=="admin"){
    $.ajax({
      url: url+'/mainFunc'+'/getProjects',
      type: 'post',
      dataType: 'json',
      data: {
        limit: '0',
        page: '0'
      },
      success:function(result){
        corpTypeArray=result.data
        $('#projectName').empty();
        $('#projectName').append("<option value=''>请选择</option>");
        $.each(result.data.list, function(index, item) {
         $('#projectName').append('<option value='+item.name+'>'+item.name+'</option>');
       });
      }
    })
  }else{
    $('#projectName').empty();
    $('#projectName').append("<option value=''>"+personProjectName+"</option>");
    $('#projectName').attr("disabled","true");
  }
  

  //实例化表格
  if(person=="admin"){
    $('#table').bootstrapTable({
      url:url+'/mainFunc'+'/showContractors',
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
        field: 'projectName',
        title: '项目名称',
        sortable: true,
      },{
        field:'corpCode',
        title:'社会信用代码',
        sortable:true,
      },{
        field:'corpName',
        title:'企业名称',
        sortable:true,
      },{
       field:'corpTypeName',
       title:'参建类型',
       sortable:true,
     }
     ]
   });
  }else{
    $('#table').bootstrapTable({
    url:url+'/mainFunc'+'/showProjectContractors',
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
      field: 'projectName',
      title: '项目名称',
      sortable: true,
    },{
      field:'corpCode',
      title:'社会信用代码',
      sortable:true,
    },{
      field:'corpName',
      title:'企业名称',
      sortable:true,
    },{
     field:'corpTypeName',
     title:'参建类型',
     sortable:true,
   }
   ]
 });
  }
  

  

//添加
$(document).on('click', "#add-a", function () {
  $('#projectName').val("");
  $('#corpCode').val("");
  $('#corpName').val("");
  $('#corpType').val("");
  $("#addModal").modal({
    backdrop: 'static'
  });
});
//提交添加信息
$(document).on('click', "#submit", function () {
  var projectName="";
  if(person=="admin"){
    projectName=$('#projectName').val();
  }else{
    projectName=personProjectName
  }
  var corpCode=$('#corpCode').val();
  var corpName=$('#corpName').val();
  var corpType=$('#corpType').val();
  var corpTypeName=$('#corpType').find("option:selected").text();
  if(projectName!=""&&corpName!=""){
    $.ajax({
      url: url+'/mainFunc'+'/addContractors',
      type: 'post',
      dataType: 'json',
      async:false,
      data: {
        projectName:projectName,
        corpCode:corpCode,
        corpName:corpName,
        corpType:corpType,
        corpTypeName:corpTypeName,
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
  }else{
    swal(
      '添加失败!',
      '请输入数据',
      'warning'
      );
  }
  
});




})