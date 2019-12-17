<script type="text/jsx">
  // 渲染表单
  function renderForm (h) {
    if (!this.$slots.form) {
      return ''
    }
    const exportButton = this.exportApi && !this.disabledExport ?
      <el-button type="info" on-click={this.exportData}><i class="el-icon-document"></i> 导出</el-button> : ''
    return (
      <div class="easy-page-form">
        <el-form inline={true} {...{
          props: {
            model: this.formData
          }
        }}>
          {this.$slots.form}
          <el-button type="success" on-click={this.search}><i class="el-icon-search"></i> 查询</el-button>
          {exportButton}
        </el-form>
      </div>
    )
  }

  // 渲染按钮工具栏
  function renderToolbar (h) {
    return this.$slots.toolbar ?
      <div class="easy-page-toolbar">{this.$slots.toolbar}</div> : ''
  }

  // 渲染表格 column
  function renderTableColumn (h, column, context) {
    if (column.render && Object.prototype.toString.call(column.render) === '[object Function]') {
      const slotScope = {
        scopedSlots: {
          default: scope => column.render.call(context, h, scope)
        }
      }
      return (
        <el-table-column
          type={column.type}
          label={column.label || ''}
          prop={column.prop || ''}
          width={column.prop || ''}
          fixed={column.fixed || undefined}
          show-overflow-tooltip={true}>
          {...slotScope}
        </el-table-column>
      )
    }
    return (
      <el-table-column
          type={column.type}
          label={column.label || ''}
          prop={column.prop || ''}
          width={column.prop || ''}
          fixed={column.fixed || undefined}
          show-overflow-tooltip={true}
          formatter={column.formatter || undefined}
          selectable={column.selectable}>
      </el-table-column>
    )
  }

  // 渲染表格
  function renderTable (h) {
    const table = this.columns.map(item => renderTableColumn(h, item, this.$parent))
    return (
      <div class="easy-page-table">
        <el-table
          ref="table"
          data={this.tableList}
          stripe
          border
          highlight-current-row
          tooltip-effect="dark"
          height={this.tableHeight}
          max-height={this.maxHeight}
          row-key={this.rowKey}
          tree-props={this.tableTreeProp}
          on-select={this.selectItem}
          on-selection-change={this.selectChange}
          on-select-all={this.selectAll}>
          {table}
        </el-table>
      </div>
    )
  }

  // 渲染分页
  function renderPagination (h) {
    return (
      <div class="easy-page-pagination">
        <el-pagination
          layout="total, sizes, prev, pager, next"
          current-page={this.page}
          page-size={this.pageSize}
          page-sizes={this.pageSizes}
          total={this.total}
          on-current-change={page => this.page = page}
          on-size-change={size => this.pageSize = size}>
        </el-pagination>
      </div>
    )
  }


  export default {
    components: {},
    props: {
      // 组件布局 默认插槽、表单、按钮工具栏、表格、分页
      layout: {
        type: Array,
        default () {
          return ['slot', 'form', 'toolbar', 'table', 'pagination']
        },
        require: true
      },
      // 表单
      formData: {
        type: Object
      },
      // 表格数组
      columns: {
        type: Array,
        require: true
      },
      tableHeight: {
        type: String
      },
      maxHeight: {
        type: String
      },
      // tree-table唯一标识
      rowKey: {
        type: String,
        default: 'id'
      },
      // tree-table以及懒加载
      tableTreeProp: {
        type: Object,
        default () {
          return {
            children: 'children',
            hasChildren: 'hasChildren'
          }
        }
      },
      // 表格是否单选
      selectLimit: {
        type: Boolean,
        default: false
      },
      // 查询、翻页时是否清空selection/selectionAll
      isClear: {
        type: Boolean,
        default: false
      },
      pageSizes: {
        type: Array,
        default () {
          return ['10', '20', '30', '40']
        }
      },
      // 请求接口
      getApi: {
        type: String,
        require: true
      },
      // 导出接口
      exportApi: {
        type: String
      },
      // 禁用导出
      disabledExport: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        tableList: [],
        page: 1,
        pageSize: 10,
        total: 0,
        selection: [],
        selectionInfo: [],
        selectionAll: [],
        isSelectAll: false
      }
    },
    watch: {
      page: 'query',
      pageSize: 'query'
    },
    mounted () {
      this.query()
    },
    methods: {
      // 请求数据
      query () {
        if (!this.getApi) {
          return
        }
        let params = {}
        let isPagination = this.layout.indexOf('pagination') !== -1
        if (isPagination) {
          params = {
            page: this.page,
            pageSize: this.pageSize,
            ...this.formData
          }
        } else {
          params = {
            ...this.formData
          }
        }
        this.$http.get(this.getApi, {params, headers: {loading: true}}).then(res => {
          // api请求成功的code 根据不同规范去自定义
          let suc = res.code === '0001'
          // 分页情况下 多一层data
          this.tableList = suc ? (isPagination ? res.data.data : res.data) : []
          this.total = suc ? (isPagination ? res.data.total : res.total) : 0
          // 将表格数据传递给父组件
          this.$emit('getTableList', this.tableList)
          if (this.isClear) {
            this.clearSelect()
          }
        })
      },
      // 查询
      search () {
        // 页数置为1
        this.page = 1
        this.query()
      },
      // 导出数据
      exportData () {},
      // 表格勾选事件
      selectItem (selection, row) {
        // 表格单选
        if (this.selectLimit) {
          this.tableList.forEach((item) => {
            this.$refs.table.toggleRowSelection(item, false)
          })
          if (selection.length === 0) {
            this.$refs.table.toggleRowSelection(row, true)
          }
          this.selection = [+row.id]
          this.selectionInfo = [{...row}]
          if (this.selection.length && +row.id === +this.selection[0]) {
            this.$refs.table.toggleRowSelection(row, true)
          }
        } else {
          const index = this.selection.indexOf(+row.id)
          if (index > -1) {
            this.selection.splice(index, 1)
            this.selectionInfo.splice(index, 1)
          } else {
            this.selection.push(+row.id)
            this.selectionInfo.push(row)
          }
        }
        this.updateSelect()
      },
      // 表格勾选选项改变
      selectChange (selection) {
        this.selectionAll = Array.from(new Set([...selection, ...this.selectionAll]))
      },
      // 表格全选/取消全选
      selectAll (selection) {
        if (this.selectLimit) {
          this.tableList.forEach((item) => {
            this.$refs.table.toggleRowSelection(item, false)
            if (+item.id !== +this.selection[0]) {
              this.$refs.table.toggleRowSelection(item, false)
            } else if (this.selection.length && +item.id === +this.selection[0]) {
              this.$refs.table.toggleRowSelection(item, true)
            }
          })
        } else {
          if (selection.length === 0) {
            this.tableList.forEach((item) => {
              // 树形表格 存在子数据的时候
              // 现版本2.12.0 树形表格 勾选父数据时子数据不会被勾选 这里手动处理
              if (item.children) {
                item.children.forEach(c => {
                  const index = this.selection.indexOf(+c.id)
                  if (index > -1) {
                    this.selection.splice(index, 1)
                    this.selectionInfo.splice(index, 1)
                    this.$refs.table.toggleRowSelection(c, false)
                  }
                })
              } else {
                const index = this.selection.indexOf(+item.id)
                if (index > -1) {
                  this.selection.splice(index, 1)
                  this.selectionInfo.splice(index, 1)
                  this.$refs.table.toggleRowSelection(item, false)
                }
              }
            })
            this.isSelectAll = false
          } else {
            const idArr = []
            if (!this.isSelectAll) {
              this.tableList.forEach(s => {
                idArr.push(+s.id)
                this.$refs.table.toggleRowSelection(s, true)
                if (s.children) {
                  s.children.forEach(c => {
                    idArr.push(+c.id)
                    this.$refs.table.toggleRowSelection(c, true)
                  })
                }
              })
              this.isSelectAll = true
            } else {
              this.tableList.forEach(s => {
                this.$refs.table.toggleRowSelection(s, false)
                if (s.children) {
                  s.children.forEach(c => {
                    this.$refs.table.toggleRowSelection(c, false)
                  })
                }
              })
              this.isSelectAll = false
              this.selection = []
            }
            this.selection = Array.from(new Set([...idArr, ...this.selection])).map(item => +item)
            this.selectionInfo = Array.from(new Set([...selection, ...this.selectionInfo]))
          }
        }
        this.updateSelect()
      },
      // 向上传递数据
      updateSelect () {
        this.$emit('selectionChange', this.selection, this.selectionInfo)
        this.$emit('selectionAll', this.selectionAll)
      },
      // 重置表格勾选状态
      clearSelect () {
        this.selection = []
        this.selectionInfo = []
        this.selectionAll = []
        this.isSelectAll = false
        this.$emit('selectionChange', this.selection, this.selectionInfo)
      }
    },
    render (h) {
      const MAP = {
        form: renderForm.call(this, h),
        toolbar: renderToolbar.call(this, h),
        table: renderTable.call(this, h),
        pagination: renderPagination.call(this, h),
        slot: (<div class="easy-page-slot">
          {this.$slots.default}
        </div>)
      }
      const map = this.layout.map(item => MAP[item])
      return (
        <div class="easy-page">
          {map}
        </div>
      )
    }
  }
</script>

<style>
.easy-page {
  padding: 10px 15px;
}
.easy-page-toolbar, .easy-page-table, .easy-page-pagination {
  margin-top: 20px;
}
.easy-page-form {
  padding: 5px;
}
.easy-page-pagination {
  text-align: right;
}
</style>
