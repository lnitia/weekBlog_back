<template>
  <div class="block"
   v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of list" :key="index" :timestamp="item.pub_date" placement="top" >
        <el-card :key="index" @click.native="show(index,item)">
          <h4>{{ item.title }}</h4>
          <mavon-editor
          v-show="isShow"
              v-model="list[index].content"
              :subfield="false"
              :box-shadow="false"
              default-open="preview"
              :toolbars-flag="false"
            />
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import {fetchArticle} from "@/api/article"
export default {
  data() {
    return {
      isShow:false,
      uid:1,
      list:[],
     loading:true
    }
  },
  created() {
    this.uid=localStorage.getItem("uid")
   this.getArticle() 
  
  },
  methods: {
    show(index,item){
      if(this.list[index].content==item.content){
      this.isShow=!this.isShow
      return this.isShow
      }
   
    },
    getArticle(){
      this.loading = true
      fetchArticle(this.uid).then(response => {
        this.list = response.data
         console.log(this.list)
        this.loading = false
      })
    }
  },
}
</script>
