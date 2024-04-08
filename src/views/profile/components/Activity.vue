<template>
  <div class="user-activity"
   v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading">
    <div class="post" v-for="(item, index) of list" :key="index">
      <div class="user-block">
        <img
          class="img-circle"
          src="../../../assets/1.png"
          v-if="!imageUrl"
        />
        <img
          class="img-circle"
          v-if="imageUrl" :src=" 'http://127.0.0.1:3007/images/'+imageUrl"
        />
        <span class="username text-muted">{{ username }}</span>
        <span class="description">{{ item.pub_date }}</span>
      </div>
      <mavon-editor
        v-model="list[index].content"
        :subfield="false"
        :box-shadow="false"
        default-open="preview"
        :toolbars-flag="false"
      />
      <ul class="list-inline">
        <li>
          <span class="link-black text-sm">
            <i class="el-icon-share" />
            Share
          </span>
        </li>
        <li>
          <span class="link-black text-sm">
            <svg-icon icon-class="like" />
            Like
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { fetchArticle } from "@/api/article";
export default {
  data() {
    return {
      loading:true,
      uid: 1,
      list: [],
      username: "",
      imageUrl:""
    };
  },
  created() {
    this.imageUrl=localStorage.getItem("imageUrl");
     if(this.imageUrl===null){
     this.image="1.png"
   }
    this.uid = localStorage.getItem("uid");
    this.username = localStorage.getItem("username");
    this.getArticle();
  },
  methods: {
    getArticle() {
      this.loading = true;
      fetchArticle(this.uid).then((response) => {
        this.list = response.data;
        console.log(this.list);
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.user-activity {
  .user-block {
    .username,
    .description {
      display: block;
      margin-left: 50px;
      padding: 2px 0;
    }

    .username {
      font-size: 16px;
      color: #000;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }
  }

  .post {
    font-size: 14px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 15px;
    padding-bottom: 15px;
    color: #666;

    .image {
      width: 100%;
      height: 100%;
    }

    .user-images {
      padding-top: 20px;
    }
  }

  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;

    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
      font-size: 13px;
    }

    .link-black {
      &:hover,
      &:focus {
        color: #999;
      }
    }
  }
}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}
</style>
