$(function () {
  let layer = layui.layer
  let form = layui.form
  let laypage = layui.laypage
  let q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: ''
  }
  initTable()
  initCate()

  //获取文章列表数据
  function initTable() {
    $.ajax({
      type: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        let htmlstr = template('tpl-table', res)
        $('tbody').html(htmlstr)
        renderPage(res.total)
      }
    })
  }

  //美化时间
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)
    let y = padZero(dt.getFullYear());
    let m = padZero(dt.getMonth() + 1);
    let d = padZero(dt.getDate());

    let hh = padZero(dt.getHours());
    let mm = padZero(dt.getMinutes());
    let ss = padZero(dt.getSeconds());


    return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss

  }
  //补零函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }


  function initCate() {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败！')
        }
        let htmlstr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlstr)
        form.render()

      }
    })
  }

  $('#form-search').on('submit', function (e) {
    e.preventDefault();

    let cate_id = $('[name=cate_id]').val();
    let state = $('[name=state]').val();
    q.cate_id = cate_id
    q.state = state
    initTable()
  })




  function renderPage(total) {
    laypage.render({
      elem: 'pageBox',
      count: total,
      limit: q.pagesize,
      curr: q.pagenum,
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      jump: function (obj, first) {
        q.pagenum = obj.curr
        q.pagesize = obj.limit
        if (!first) {
          initTable();
        }
      }
    });
  }


  $('tbody').on('click', '.btn-delete', function () {
    let len = $('.btn-delete').length
    let id = $(this).attr('data-id');
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        type: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')
          if (len == 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable();
        }
      })
      layer.close(index);
    });
  })


})