<!--  -->
<template>
  <div class="currentW"
   v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading">
  
    <el-row :gutter="40" class="el-row" type="flex">
      <el-col
        v-for="(item, index) in listOfPerson"
        :key="item.id"
        :span="5"
        class="el-col"
      >
        <el-card :key="index" class="el-card" @click.native="checkUser(item.id)">
          <div slot="header" class="clearfix">
            <img
              src="@/assets/1.png"
              class="image"
               v-if="!item.user_pic"
            />
            <img v-if="item.user_pic" :src="'http://127.0.0.1:3007/images/'+item.user_pic" class="image" alt />
            <div>{{ item.username }}</div>
          </div>
          <div>
            <div class="text item">
              <div class="item_tag">
                <span>邮箱：</span>
              </div>
              <div class="item_desr">
                <span> {{ item.email }}</span>
              </div>
            </div>
            <div class="text item">
              <div class="item_tag">
                <span>ID：</span>
              </div>
              <div class="item_desr">
                {{ item.id }}
              </div>
            </div>
            <div class="text item">
              <div class="item_tag">
                <span>角色：</span>
              </div>
              <div
                class="item_desr"
              >
                <span>
                  {{ item.roles }}
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  
   


  </div>
</template>

<script>
import { getUsers } from '@/api/user'
export default {
  name: 'UserList',
  data() {
    return {
      loading:true,
      listOfPerson: [],
      person: '',
      imageUrl:null,
      img:null
    }
  },
  created() {
    this.imageUrl=localStorage.getItem("imageUrl")
    if(this.imageUrl===null){
      this.imageUrl="1.png"
    }
this.img='http://127.0.0.1:3007/images/'+this.imageUrl
    getUsers().then((r) => {
      this.listOfPerson = r.data
      console.log(r.data)
      this.loading=false
    })
  },
  methods: {
    checkUser(uid) {
      this.$router.push({ path: '/example/articlelist', query: { Uid: uid }})
    }

  }
}
</script>

<style lang="scss">
.image {
  border: 1px dashed rgba(255, 255, 255, 0.1);
  cursor: pointer;
  //position: relative;
  overflow: hidden;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  //background-color: #283443;
  margin: 0 auto 8px auto;
}
.item {
  margin-bottom: 10px;
}
.item_tag {
  float: left;
  text-align: left;
  margin-left: 20px;
}
.item_desr {
  margin-left: 30%;
  min-height: 30px;
  text-align: left;
}
.text {
  width: 100%;
  font-size: 12px;
  font-family: "Microsoft YaHei";
  color: #909399;
}

.el-row {
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
}
.el-col {
  border-radius: 4px;
  align-items: stretch;
  margin-bottom: 20px;
}

.currentW {
  margin-top: 10px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";

}
.clearfix:after {
  clear: both;
}

.mains {
  margin-top: 0px;
  padding-top: 10px;
}

.box-card {
  width: 240px;
}
.el-card {
  min-width: 100%;
  height: 98%;
  margin-right: 15px;
  margin-left: 15px;
   text-align: center
  /*transition: all .5s;*/
}
.el-card:hover {
  margin-top: -5px;
}
</style>
