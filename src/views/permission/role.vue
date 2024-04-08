<template>
  <div class="app-container"
   v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading">

    <el-table :data="listOfPerson" style="width: 100%; margin-top: 30px" border>
      <el-table-column type="index" align="center" label="编号" width="220">
      </el-table-column>
      <el-table-column align="center" label="用户名" width="220">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="邮箱">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色">
        <template slot-scope="scope">
         {{ scope.row.roles }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="edit(scope.row)"
            >更改角色</el-button
          >

          <el-button type="danger" size="small" @click="del(scope.row)"
            >删除用户</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div v-if="info.roles!==undefined">
        <p>当前的用户: {{ info.username }}</p>
        <p>当前的角色: {{ info.roles}}</p>
        <p>
          分配新角色:
          <!-- 角色选择下拉框
        v-model：设置用户选中角色之后的id绑定数据
        -->
          <el-select v-model="selectedRoleId" placeholder="请选择角色">
            <!-- :label 显示文本，:value 选中值 -->
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.roleName"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  


  </div>
</template>

<script>
import path from "path";
import { deepClone } from "@/utils";
import { getUsers } from "@/api/user";
import { editRole,deleteRole } from "@/api/role";
import { Message } from 'element-ui';

const defaultRole = {
  key: "",
  name: "",
  description: "",
  routes: [],
};

export default {
  data() {
    return {
      loading:true,
      listOfPerson: [],
      selectedRoleId: [],
      setRoleDialogVisible: false,
      person: "",
      enabled: true,
      noedit: true,
      chiocelist: [],
      rolesList: [
        { id: 1, roleName: "admin" },
        { id: 2, roleName: "user" },
       
      ],
      checked: true,
      info: {},
    };
  },
  computed: {},
  created() {
    getUsers().then((r) => {
      console.log(r.data)
      this.listOfPerson = r.data;
      this.loading=false
    });
  },
  methods: {
    edit(info) {
      this.info = info;
      this.setRoleDialogVisible = true;
      // this.enabled=false
      // this.noedit=false
    },
    del(info){
     deleteRole(info.id).then(res=>{
          this.$router.go(0);
     })
    },

    saveRoleInfo() {
      console.log(this.info)
      editRole(this.selectedRoleId,this.info.id).then(res=>{
        if(res){
          this.setRoleDialogVisible = false;
           this.$router.go(0);

          Message("更新成功")
        }else{
          Message("请重新选择")
        }
      })
    },
    setRoleDialogClosed() {
      this.setRoleDialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
