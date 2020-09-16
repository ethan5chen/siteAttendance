$(function () {
  //实例化表格
  $('#table').bootstrapTable({
    url:url+'/mainFunc'+'/showLeaders',
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
      field: 'name',
      title: '领导名',
      sortable: true,
    },{
      field:'typeName',
      title:'证件类型',
      sortable:true,
    },{
      field:'idCard',
      title:'证件号码',
      sortable:true,
    }
    ]
  });

//导出
$(document).on('click', "#exportButton", function () {
  $.ajax({
    url: url+'/mainFunc'+'/expertLeaders',
    type: 'post',
    dataType: 'json',
    async:false,
    data: {},
    success:function(result){
      console.log(result.data);
      window.open(result.data);
    }
  })
})

//添加
$(document).on('click', "#add-a", function () {
  $('#leaderName').val("");
  $('#idCardType').val("");
  $('#idCardNumber').val("");
  $("#addModal").modal({
    backdrop: 'static'
  });
});

//添加
$(document).on('click', "#submit", function () {
  var fd = new FormData();
  var leaderName=$('#leaderName').val();
  var idCardType=$('#idCardType').val();
  var idCardTypeName=$('#idCardType').find("option:selected").text();
  var idCardNumber=$('#idCardNumber').val();
  var headImage=$("#headImage").get(0).files[0];
  fd.append("name", leaderName);
  fd.append("type", idCardType);
  fd.append("typeName", idCardTypeName);
  fd.append("idCard", idCardNumber);
  fd.append("img", headImage);
  console.log(fd);
  if(leaderName!=""){
    $.ajax({
      url: url+'/mainFunc'+'/addLeaders',
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