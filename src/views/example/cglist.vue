<template>
  <div
   v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading">
    <el-table
      ref="multipleTable"
      :data="list"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column align="center" label="日期" width="120">
        <template slot-scope="scope">{{ scope.row.time }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="username"
        label="用户名"
        width="120"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="title"
        label="文章标题"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="edit(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" size="small" @click="del(list, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="delall()"
        >删除所选</el-button
      >
      <el-button @click="toggleSelection()">取消选择</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading:true,
      list: [],
      multipleSelection: [],
    };
  },
  created() {
    this.list = JSON.parse(localStorage.getItem("cglist"));
    this.loading=false
  },
  methods: {
      edit(info){
        console.log("111",info)
       this.$router.push({
        path: "/example/edit",
        query: { Info:info},
      });
      },
    del(_arr, info) {
      console.log("222",info)
      this.list = this.delete(_arr, info);
      localStorage.setItem("cglist", JSON.stringify(this.list));
      location.reload;
      //console.log(info)
    },
    delete(_arr, info) {
      var length = _arr.length;
      for (var i = 0; i < length; i++) {
        if (_arr[i] == info) {
          if (i == 0) {
            _arr.shift(); //删除并返回数组的第一个元素
            return _arr;
          } else if (i == length - 1) {
            _arr.pop(); //删除并返回数组的最后一个元素
            return _arr;
          } else {
            _arr.splice(i, 1); //删除下标为i的元素
            return _arr;
          }
        }
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    delall(){
       for(let i=0;i<this.multipleSelection.length;i++){
           this.del(this.list,this.multipleSelection[i])
       }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>

