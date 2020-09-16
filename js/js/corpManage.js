$(function () {
  //实例化表格
  $('#table').bootstrapTable({
    url:url+'/mainFunc'+'/showEnterprise',
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
      field: 'corpCode',
      title: '社会信用代码',
      sortable: true,
    },{
      field:'corpName',
      title:'企业名称',
      sortable:true,
    },{
      field:'corpType',
      title:'企业性质',
      sortable:true,
    },{
      field:'address',
      title:'企业注册地区',
      sortable:true,
    }
    ]
  });

  

//添加 清空input框
$(document).on('click', "#add-a", function () {
  $('#corpCode').val("");
  $('#corpName').val("");
  $('#corpType').val("");
  $('#corpAddress').val("");
  $("#addModal").modal({
    backdrop: 'static'
  });
});
//添加
$(document).on('click', "#submit", function () {
  var corpCode=$('#corpCode').val();
  var corpName=$('#corpName').val();
  var corpType=$('#corpType').val();
  var corpAddress=$('#corpAddress').val();
  if(corpCode!=""&&corpName!=""){
    $.ajax({
      url: url+'/mainFunc'+'/addEnterprise',
      type: 'post',
      dataType: 'json',
      async:false,
      data: {
        corpCode:corpCode,
        corpName:corpName,
        corpType:corpType,
        address:corpAddress,
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
      '',
      'error'
      );
  }
  
});


})