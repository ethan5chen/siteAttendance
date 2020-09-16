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
      $('#projectName').append("<option value=''>请选择</option>");
      $.each(result.data.list, function(index, item) {
        $('#projectName').append('<option  value='+item.name+'>'+item.name+'</option>');
      });
    }
  })
 }else{
  $('#projectName').empty();
  $('#projectName').append('<option value='+personProjectName+'>'+personProjectName+'</option>');
  $('#projectName').attr("disabled","true");
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

  //实例化表格
//   $('#table').bootstrapTable({
//     url:url+'/mainFunc'+'/showAtt',
//     method: 'post',
//     pagination: true,
//     search: false,
//     dataType:'json',
//     toolbar:'#toolbar',
//     striped:true,
//     pageSize:'15',
//     pageList: [10, 25, 50, 100],
//     showRefresh:false,
//     dataField: "data",
//     contentType: "application/x-www-form-urlencoded",
//     mobileResponsive:true,
//     useRowAttrFunc: true,
//     sidePagination:'server',
//     pageNumber: 1,
//     responseHandler:function(res){
//       res.total=res.count;
//       return res;
//     },
//     queryParams:function(params){
//       return{
//         limit:params.limit,
//         page:(params.offset/params.limit)+1,
//         projectName:$('#projectName').val(),
//         teamName:$('#teamName').val(),
//         idCardNumber:$('#workerIdCardNumber').val(),
//         date:$('#date').val(),
//       }
//     },
//     columns:[{
//      field:'date',
//      title:'日期',
//      sortable:true,
//    },{
//     field:'projectName',
//     title:'项目名称',
//     sortable:true,
//   },{
//     field:'teamName',
//     title:'班组名称',
//     sortable:true,
//   },{
//     field: 'workerName',
//     title: '工人姓名',
//     sortable: true,
//   },{
//    field:'idCardNumber',
//    title:'证件号码',
//    sortable:true,
//  },{
//    field:'inTime',
//    title:'进场时间',
//    sortable:true,
//  },{
//    field:'outTime',
//    title:'出场时间',
//    sortable:true,
//  },{
//    field:'lenght',
//    title:'本次工作时长',
//    sortable:true,
//  }
//  ]
// });

//模糊查询
$(document).on('click', "#searchButton", function () {
  var projectName=$('#projectName').val();
  if(projectName!=""){
    $('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
      url:url+'/mainFunc'+'/showAtt',
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
          projectName:projectName,
          teamName:$('#teamName').val(),
          idCardNumber:$('#workerIdCardNumber').val(),
          startDate:$('#startDate').val(),
          endDate:$('#endDate').val(),
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
     title:'证件号码',
     sortable:true,
   },{
     field:'inTime',
     title:'进场时间',
     sortable:true,
   },{
     field:'outTime',
     title:'出场时间',
     sortable:true,
   },{
     field:'length',
     title:'本次工作时长',
     sortable:true,
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



})