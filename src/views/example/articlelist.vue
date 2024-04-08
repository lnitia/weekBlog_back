<template>
  <div class="currentW"
   v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading">
    <el-container
      style="
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      "
    >
      <!-- <el-header class="tit" height="40px">{{ username }}的周报</el-header> -->
      <el-main class="mains">
        <el-collapse accordion class="card">
          <el-collapse-item
            v-for="(item, index) in list"
            :key="index"
            :name="index"
          >
            <template slot="title" class="tit">
              <div class="title">{{ item.title }}</div>
              <div class="time text-item">{{ item.pub_date|data }}</div>
              <div class="check1">
                <el-link icon="el-icon-view">查看 </el-link>
              </div>
              <div v-if="hasadmin()" class="edit1" @click="edit(item.id, uid)">
                <el-link icon="el-icon-edit">编辑</el-link>
              </div>
              <div v-if="hasadmin()" class="del1" @click="del(item.id)">
                <el-link icon="el-icon-delete">删除</el-link>
              </div>
            </template>
            <mavon-editor
              v-model="item.content"
              :subfield="false"
              :box-shadow="false"
              default-open="preview"
              :toolbars-flag="false"
              :externalLink="externalLink"
               :codeStyle="codeStyle"
            />
          </el-collapse-item>
        </el-collapse>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { fetchArticle, delArticle } from "@/api/article";

export default {
  name: "ArticleList",
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      loading:true,
      codeStyle:"",
      externalLink: {
            markdown_css: function() {
                // 这是你的markdown css文件路径
                return '/mavon-editor/markdown/github-markdown.min.css';
            },
            hljs_js: function() {
                // 这是你的hljs文件路径
                return '/mavon-editor/highlightjs/highlight.min.js';
            },
            hljs_css: function(css) {
                // 这是你的代码高亮配色文件路径
                return '/mavon-editor/highlightjs/styles/' + css + '.min.css';
            },
            hljs_lang: function(lang) {
                // 这是你的代码高亮语言解析路径
                return '/mavon-editor/highlightjs/languages/' + lang + '.min.js';
            },
            katex_css: function() {
                // 这是你的katex配色方案路径路径
                return '/mavon-editor/katex/katex.min.css';
            },
            katex_js: function() {
                // 这是你的katex.js路径
                return '/mavon-editor/katex/katex.min.js';
            },
        },
      list: null,
      roles: [],
      uid: 1,
      username: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
      },
    };
  },
  filters:{
     data(value){
      return value.substring(0,10)
     }
  },
  created() {
    this.getUsername();
    this.uid = this.getUid();
    if (this.uid == null) {
      this.list = [];
      this.loading=false
    } else {
      this.getList();
    }
  },
  methods: {
    hasadmin() {
      (this.roles = localStorage.getItem("roles"))
      if (this.roles.indexOf("admin") !== -1) {
        return true;
      } else {
        return false;
      }
    },
    getUsername() {
      this.username = localStorage.getItem("username");
    },
    getUid() {
      var uid = this.$route.query.Uid;
      return uid;
    },
    getList() {
      this.listLoading = true;
      fetchArticle(this.uid).then((response) => {
        this.list = response.data;
        this.listLoading = false;
        this.loading=false
      });
    },
    edit(aid, uid) {
      this.$router.push({
        path: "/example/edit",
        query: { Aid: aid, Uid: uid },
      });
    },
    del(aid) {
      delArticle(aid).then((res) => {
        //  location.reload()
        this.$router.push({ path: "/example/userlist" });
      });
    },
  },
  mounted(){
    let that = this;
        that.codeStyle = "atom-one-dark";
  }
};
</script>

<style scoped>
.currentW {
  margin: 0 10px auto 10px;
}
.time {
  font-size: 12px;
  top: 64px;
  left: 30px;
}
.tit .el-collapse-item__header {
  font-size: 30px;
  padding-left: 30px;
  height: 70px;
}
.title {
  font-size: 28px;
  margin-top: -37px;
}
.mains {
  margin-top: 0px;
  padding-top: 10px;
}
.card {
  margin-top: 0px;
}

.el-button {
  border: 0px !important;
  padding-top: 20px !important ;
}
.el-collapse-item {
  position: relative;
}
.check1 {
  position: absolute;
  left: 250px;
}
.edit1 {
  position: absolute;
  left: 305px !important;
}
.del1 {
  position: absolute;
  left: 360px;
}
</style>
