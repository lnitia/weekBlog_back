<template>
  <el-form>
    <el-form-item label="Name">
      <el-input v-model.trim="user.name" :disabled="isChange"/>
    </el-form-item>
    <el-form-item label="Email">
      <el-input v-model.trim="user.email" :disabled="isChange"/>
    </el-form-item>
    <el-button type="primary" @click="change()" size="mini" v-if="!isOk">修改</el-button>
    <el-button type="info" @click="change()" size="mini" v-if="isOk">取消</el-button>
    <el-button type="danger" @click="ok()" size="mini" v-if="isOk">确定</el-button>
  </el-form>
</template>

<script>
import {updateInfo} from "@/api/user"
import { Message } from 'element-ui';
export default {
  data() {
    return {
      newuser:{}
    }
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: ''
        }
      }
    }
  },
  created(){
    this.newuser=this.user
  },
 data() {
  return {
    isChange:true,
    isOk:false
  }
 },
 methods:{
  change(){
    this.isChange=!this.isChange
    this.isOk=!this.isOk
  },
  ok(){
    this.isChange=!this.isChange
    this.isOk=!this.isOk
    console.log(this.user)
    updateInfo(this.user.name,this.user.email).then((res)=>{
      if(res.status==1){
        Message.error("更改错误")
      }else{
        localStorage.setItem("username",res.results[0].username)
        localStorage.setItem("email",res.results[0].email)
        Message.success("修改成功")
      }
    })
  }
 }
}
</script>
