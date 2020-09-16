$(function () {
  var person=sessionStorage.getItem('username')
  var personProjectName=sessionStorage.getItem('productName')
  var personProjectCode=sessionStorage.getItem('productCode')
  console.log(personProjectName)
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
    
    
    function getCorpCodeByCorpName(corpName){
      var corpCode=""
      $.ajax({
        url: url+'/mainFunc'+'/getEnterprise',
        type: 'post',
        dataType: 'json',
        async:false,
        data: {},
        success:function(result){
          $.each(result.data, function(index, item) {
           if(item.corpName==corpName){
            corpCode=item.corpCode;
          }
        });
        }
      })
      return corpCode;
    }
    //获取班组数据
    $.ajax({
      url: url+'/mainFunc'+'/getGroups',
      type: 'post',
      dataType: 'json',
      async:false,
      data: {
        projectName:$('#projectName').val(),
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
  //实例化表格
  $('#table').bootstrapTable({
    url:url+'/mainFunc'+'/showWorks',
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
        projectName:$('#projectName').val(),
        teamName:"",
        workType:"",
      }
    },
    columns:[{
      field: 'workerName',
      title: '工人姓名',
      sortable: true,
    },{
      field:'idCardTypeName',
      title:'证件类型',
      sortable:true,
    },{
      field:'idCardNumber',
      title:'证件号码',
      sortable:true,
    },{
      field:'gender',
      title:'性别',
      sortable:true,
    },{
      field:'workTypeName',
      title:'当前工种',
      sortable:true,
    },{
      field:'workRoleName',
      title:'工人类型',
      sortable:true,
    },{
      field:'isTeamLeader',
      title:'是否班组长',
      formatter:function (value,row,index){
        if(row.isTeamLeader=="1"){
          return "是";
        }else if(row.isTeamLeader=="0"){
          return "否"
        }
      }
    },{
      field:'projectName',
      title:'项目名称',
      sortable:true,
    },{
      field:'teamName',
      title:'班组名称',
      sortable:true,
    },{
      field:'hasContract',
      title:'合同状态',
      formatter:function (value,row,index){
        if(row.hasContract=="0"){
          return "未上传";
        }else{
          return "已上传"
        }
      }
    },{
      field:'null',
      title:'操作',
      formatter:actionFormatter,
    }
    ]
  });

  //模糊查询表格
  //模糊搜索
  $(document).on('click', "#searchButton", function () {
    $('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
      url:url+'/mainFunc'+'/showWorks',
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
          projectName:$("#projectName").val(),
          teamName:$("#teamName").val(),
          workType:$("#workType").val(),
        }
      },
      columns:[{
        field: 'workerName',
        title: '工人姓名',
        sortable: true,
      },{
        field:'idCardTypeName',
        title:'证件类型',
        sortable:true,
      },{
        field:'idCardNumber',
        title:'证件号码',
        sortable:true,
      },{
        field:'gender',
        title:'性别',
        sortable:true,
      },{
        field:'workTypeName',
        title:'当前工种',
        sortable:true,
      },{
        field:'workRoleName',
        title:'工人类型',
        sortable:true,
      },{
        field:'isTeamLeader',
        title:'是否班组长',
        formatter:function (value,row,index){
          if(row.isTeamLeader=="1"){
            return "是";
          }else if(row.isTeamLeader=="0"){
            return "否"
          }
        }
      },{
        field:'projectName',
        title:'项目名称',
        sortable:true,
      },{
        field:'teamName',
        title:'班组名称',
        sortable:true,
      },{
        field:'hasContract',
        title:'合同状态',
        formatter:function (value,row,index){
          if(row.hasContract=="0"){
            return "未上传";
          }else{
            return "已上传"
          }
        }
      },{
        field:'null',
        title:'操作',
        formatter:actionFormatter,
      }
      ]
    });
  })
  

  //渲染按钮
  function actionFormatter(value,row, index) {
    let id = row.id;
    // delete row.ability;
    let result = "";
    if(row.upTo=="1"&&row.hasContract=="0"){
      result += "<button class='btn btn-xs btn-success export' row='"+JSON.stringify(row)+"' role_id="+id+" title='上传合同'><span>上传合同</span></button>";
    }
    result += "<button class='btn btn-xs btn-success outCon' row='"+JSON.stringify(row)+"' role_id="+id+" title='导出文件'><span>导出文件</span></button>";
    return result;
  }
  var row="";




  $(document).on('click', ".export", function () {
    //回显到页面
    row=$.parseJSON($(this).attr('row'));
    if(row.upTo=="0"){
      swal(
        '上传失败!',
        result.message,
        'error'
        ).then(function(){
          return;
        });
      }
      $('#upProjectName').val(row.projectName);
      $('#upCorpCode').val(row.corpName);
      $('#upTeamName').val(row.teamName);
      $('#upWorkerName').val(row.workerName);
      $('#upWorkerIDCardNumber').val(row.idCardNumber);
      $("#upContract").modal({
        backdrop: 'static'
      });
    })
  function downloadFile (url)  {
    console.log(url)
    const iframe = document.createElement("iframe");
        iframe.style.display = "none"; // 防止影响页面
        iframe.style.height = 0; // 防止影响页面
        iframe.src = url;
        document.body.appendChild(iframe); // 这一行必须，iframe挂在到dom树上才会发请求
        // 5分钟之后删除（onload方法对于下载链接不起作用，就先抠脚一下吧）
        setTimeout(()=>{
          iframe.remove();
        }, 5 * 60 * 1000);
      }
      $(document).on('click', ".outCon", function () {
        var row=$.parseJSON($(this).attr('row'));
        console.log(row)
        //工人进场承诺书
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
              downloadFile(result.data.url);
            }else if (result.code===1){
              swal(
                '导出失败!',
                result.message,
                'error'
                );
            }
          }
        })

        //工人退场确认书
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
              downloadFile(result.data.url);
            }else if (result.code===1){
              swal(
                '导出失败!',
                result.message,
                'error'
                );
            }
          }
        })
        //工资支付方式确认单
        $.ajax({
          url: url+'/exportFunc'+'/exportWagePay',
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
              downloadFile(result.data.url);
            }else if (result.code===1){
              swal(
                '导出失败!',
                result.message,
                'error'
                );
            }
          }
        })
        //工人合同
        downloadFile(row.url)

        //是班组长
        if(row.isTeamLeader=="1"){
          //导出班组长进场承诺书
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
                downloadFile(result.data.url);
              }else if (result.code===1){
                swal(
                  '导出失败!',
                  result.message,
                  'error'
                  );
              }
            }
          })
          //导出班组长退场承诺书
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
                downloadFile(result.data.url);
              }else if (result.code===1){
                swal(
                  '导出失败!',
                  result.message,
                  'error'
                  );
              }
            }
          })

        }

      })


$(document).on('click','#edit-save-button',function(){
  var fd = new FormData();
  var projectName=$('#upProjectName').val();
  var teamName=$('#upTeamName').val();
  var corpName=row.corpName;
  var corpCode=getCorpCodeByCorpName(corpName);
  var workerName=row.workerName;
  var idCardNumber=row.idCardNumber;
  var contractPeriodType=parseInt($('#contractPeriodType').val());
  var startDate=$('#startDate').val();
  var endDate=$('#endDate').val();
  var AttachmentOne=$('#AttachmentOne').get(0).files[0];
  var AttachmentTwo=$('#AttachmentTwo').get(0).files[0];
  fd.append("projectName", projectName);
  fd.append("corpCode", corpCode);
  fd.append("corpName", corpName);
  fd.append("teamName", teamName);
  fd.append("workerName", workerName);
  fd.append("idCardNumber", idCardNumber);
  fd.append("contractPeriodType", contractPeriodType);
  fd.append("startDate", startDate);
  fd.append("endDate", endDate);
  if(AttachmentOne!=undefined){
    fd.append("AttachmentOne", AttachmentOne);
  }
  if(AttachmentTwo!=undefined){
    fd.append("AttachmentTwo", AttachmentTwo);
  }

  $.ajax({
    url: url+'/hardFunc'+'/upContract',
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
        $("#upContract").modal('hide');
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

  //导出工人银行卡登记表
  $(document).on('click', "#exportBankCard", function () {
    console.log("exportBankCard")
    $.ajax({
      url: url+'/exportFunc'+'/exportWorkerBankCards',
      type: 'post',
      dataType: 'json',
      async:false,
      data: {
        projectName:$('#projectName').val(),
        teamName:$('#teamName').val(),
      },
      success:function(result){
        if (result.code === 0) {
          console.log(result);
          result.productName=$('#projectName').val();
          result.teamName=$('#team').val();
          result.date=$("#date").val();
          sessionStorage.setItem("BankCountStaData",JSON.stringify(result))
          window.location.href="test.html";
        }else if (result.code===1){
          swal(
            '查询失败!',
            result.message,
            'error'
            );
        }
      }
    })
  })

  //导出工人花名册
  $(document).on('click', "#exportName", function () {
    console.log("exportName")
    $.ajax({
      url: url+'/exportFunc'+'/exportWorkers',
      type: 'post',
      dataType: 'json',
      async:false,
      data: {
        projectName:$('#projectName').val(),
        teamName:$('#teamName').val(),
      },
      success:function(result){
        if (result.code === 0) {
          console.log(result);
          result.productName=$('#projectName').val();
          result.teamName=$('#team').val();
          result.date=$("#date").val();
          sessionStorage.setItem("workerData",JSON.stringify(result))
          window.location.href="test4.html";
        }else if (result.code===1){
          swal(
            '查询失败!',
            result.message,
            'error'
            );
        }
      }
    })
  })
})