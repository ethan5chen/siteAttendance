$(function () {
  //获取企业
  $.ajax({
    url: url+'/mainFunc'+'/getEnterprise',
    type: 'post',
    dataType: 'json',
    data: {
      limit: '0',
      page: '0'
    },
    success:function(result){
      corpTypeArray=result.data
      $('#contractorCorpName').empty();
      $('#contractorCorpName').append("<option value=''>请选择</option>");
      $('#upContractorCorpName').empty();
      $('#upContractorCorpName').append("<option value=''>请选择</option>");
      $('#reContractorCorpName').empty();
      $('#reContractorCorpName').append("<option value=''>请选择</option>");
      $.each(result.data, function(index, item) {
       $('#contractorCorpName').append('<option value='+item.corpCode+'>'+item.corpName+'</option>');
       $('#upContractorCorpName').append('<option value='+item.corpCode+'>'+item.corpName+'</option>');
       $('#reContractorCorpName').append('<option value='+item.corpCode+'>'+item.corpName+'</option>');
     });
    }
  })

  //实例化表格
  $('#table').bootstrapTable({
    url:url+'/mainFunc'+'/showProjects',
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
      // res.total=res.count;
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
      field: 'projectCode',
      title: '项目编码',
      sortable: true,
    },{
      field:'name',
      title:'项目名称',
      sortable:true,
    },{
      field:'category',
      title:'项目分类',
      sortable:true,
    },{
   //   field:'builderLicenseNum',
   //   title:'项目许可证',
   //   sortable:true,
   // },{
     field:'builderLicenses',
     title:'施工许可证',
     sortable:true,
   },{
    field:'deptName',
    title:'主管部门',
    sortable:true,
  },{
   field:'areaCode',
   title:'项目所在地',
   sortable:true,
 },{
   field:'prjStatusName',
   title:'项目状态',
   sortable:true,
 }, {
  field: 'null',
  title: '操作',
  formatter: actionFormatter,
}
]
});

  
  //渲染按钮
  function actionFormatter(value, row, index) {
    let id = row.id;
    let result = "";
    console.log(row);
    result += "<button class='btn btn-xs btn-primary editButton' row='"+JSON.stringify(row)+"' role_id="+id+" title='修改'><span>修改</span></button>";
    if(row.upTo!="1"){
      result += "<button class='btn btn-xs btn-primary recordButton' row='"+JSON.stringify(row)+"' role_id="+id+" title='备案'><span>备案</span></button>";
    }
    
    return result;
  }


    $(document).on('click', ".recordButton", function () {
    var row=$(this).attr('row');
    row=JSON.parse(row);
    $('#reName').val(row.name);
    $('#reContractorCorpName').val(row.contractorCorpCode);
    $('#reCategory').val(row.category);
    $('#reBuilderLicenses').val(row.builderLicenses);
    $('#reAreaCode').val(row.areaCode);
    $('#reDeptName').val(row.deptName);
    $('#rePrjStatus').val(row.prjStatus);
    $("#recordModal").modal({
      backdrop: 'static'
    })
  })


  $(document).on('click', "#record_submit", function () {
    console.log('record_submit')
    console.log($('#reName').val())
    $.ajax({
      url: url+'/mainFunc'+'/uploadProject',
      type: 'post',
      dataType: 'json',
      async:false,
      data: {
       name:$('#reName').val(),
       appId:$('#appId').val(),
       secretKey:$('#secretKey').val(),
       builderLicenseNum:$('#builderLicenseNum').val(),
     },
     success: function (result) {
      if (result.code === 0) {
        swal(
          '备案成功!',
          result.message,
          'success'
          );
        $("#table").bootstrapTable('refresh');
        $("#recordModal").modal('hide');
      }else if (result.code===1){
        swal(
          '备案失败!',
          result.message,
          'error'
          );
      }
    },
    error: function () {
      swal(
        '备案失败!',
        '网络错误',
        'error'
        );
    }
  })
  })



  $(document).on('click', ".editButton", function () {
    var row=$(this).attr('row');
    row=JSON.parse(row);

    $('#upName').val(row.name);
    $('#upContractorCorpName').val(row.contractorCorpCode);
    $('#upCategory').val(row.category);
    $('#upBuilderLicenses').val(row.builderLicenses);
    $('#upAreaCode').val(row.areaCode);
    $('#upDeptName').val(row.deptName);
    $('#upPrjStatus').val(row.prjStatus);
    $("#updateModal").modal({
      backdrop: 'static'
    })
  })

  $(document).on('click', "#update_submit", function () {
    console.log('update_submit')
    var name=$('#upName').val();
    var contractorCorpCode=$('#upContractorCorpName').val();
    var category=$('#upCategory').val();
    var categoryName=$('#upCategory').find("option:selected").text();
    var builderLicenses=$('#upBuilderLicenses').val();
    var deptName=$('#upDeptName').val();
    var areaCode=$('#upAreaCode').val();
    var prjStatus=$('#upPrjStatus').val();
    var prjStatusName=$('#upPrjStatus').find("option:selected").text();

    $.ajax({
      url: url+'/mainFunc'+'/updateProject  ',
      type: 'post',
      dataType: 'json',
      async:false,
      data: {
       name:name,
       contractorCorpCode:contractorCorpCode,
       category:category,
       categoryName:categoryName,
       builderLicenses:builderLicenses,
       deptName:deptName,
       areaCode:areaCode,
       prjStatus:prjStatus,
       prjStatusName:prjStatusName,
     },
     success: function (result) {
      if (result.code === 0) {
        swal(
          '修改成功!',
          result.message,
          'success'
          );
        $("#table").bootstrapTable('refresh');
        $("#updateModal").modal('hide');
      }else if (result.code===1){
        swal(
          '修改失败!',
          result.message,
          'error'
          );
      }
    },
    error: function () {
      swal(
        '修改失败!',
        '网络错误',
        'error'
        );
    }
  })
  })

//添加
$(document).on('click', "#add-a", function () {
  $('#name').val("");
  $('#contractorCorpName').val("");
  $('#category').val("");
  $('#builderLicenses').val("");
  $('#areaCode').val("");
  $('#prjStatus').val("");
  $("#addModal").modal({
    backdrop: 'static'
  });
});
//提交添加信息
$(document).on('click', "#submit", function () {
  var name=$('#name').val();
  var contractorCorpCode=$('#contractorCorpName').val();
  var category=$('#category').val();
  var categoryName=$('#category').find("option:selected").text();
  var builderLicenses=$('#builderLicenses').val();
  var deptName=$('#deptName').val();
  var areaCode=$('#areaCode').val();
  var prjStatus=$('#prjStatus').val();
  var prjStatusName=$('#prjStatus').find("option:selected").text();
  if(name!=""){
    $.ajax({
      url: url+'/mainFunc'+'/addProjects',
      type: 'post',
      dataType: 'json',
      async:false,
      data: {
        name:name,
        contractorCorpCode:contractorCorpCode,
        category:category,
        categoryName:categoryName,
        builderLicenses:builderLicenses,
        deptName:deptName,
        areaCode:areaCode,
        prjStatus:prjStatus,
        prjStatusName:prjStatusName,
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