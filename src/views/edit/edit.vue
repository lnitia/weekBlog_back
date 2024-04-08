<template>
  <el-container
    style="
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    "
  >
    <!-- <div class="switch__circle"></div>
    <div class="switch__circle switch__circle--t"></div> -->
    <div class="app-container">
      <el-form
        :label-position="'left'"
        :model="markdownForm"
        :rules="rules"
        label-width="60px"
      >
        <el-form-item label="标 题" prop="title">
          <el-input
            v-model="markdownForm.title"
            placeholder="请输入XXX的周报"
            style="
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
                0 0 6px rgba(0, 0, 0, 0.04);
            "
          />
        </el-form-item>
      </el-form>
      <mavon-editor
        ref="md"
        v-model="markdownForm.content"
        class="bjq"
        :code-style="markdown.codeStyle"
        :toolbars="markdown.toolbars"
        @save="save"
        @imgAdd="imgAdd"
        @imgDel="imgDel"
        :externalLink="externalLink"
      />
      <br />
      <el-row style="float: right">
        <el-button @click="goback">返 回</el-button>

        <el-button style="width: 140px" @click="savecg">保存至草稿箱</el-button>
        <el-button
          type="primary"
          style="float: right; background-color: #4b70e2"
          @click="save"
          >发表文章</el-button
        >
      </el-row>
    </div>
  </el-container>
</template>

<script>
import {
  getMarkdownArticleByAid,
  createMarkdownArticle,
  saveMarkdownArticle,
  uploadImg,
  // getImg
} from "@/api/article";
import { getDate } from "@/utils/date";
import axios from "axios";
import { Message } from "element-ui";
import { nanoid } from "nanoid";

export default {
  data() {
    return {
      externalLink: {
        markdown_css: function () {
          // 这是你的markdown css文件路径
          return "/mavon-editor/markdown/github-markdown.min.css";
        },
        hljs_js: function () {
          // 这是你的hljs文件路径
          return "/mavon-editor/highlightjs/highlight.min.js";
        },
        hljs_css: function (css) {
          // 这是你的代码高亮配色文件路径
          return "/mavon-editor/highlightjs/styles/" + css + ".min.css";
        },
        hljs_lang: function (lang) {
          // 这是你的代码高亮语言解析路径
          return "/mavon-editor/highlightjs/languages/" + lang + ".min.js";
        },
        katex_css: function () {
          // 这是你的katex配色方案路径路径
          return "/mavon-editor/katex/katex.min.css";
        },
        katex_js: function () {
          // 这是你的katex.js路径
          return "/mavon-editor/katex/katex.min.js";
        },
      },
      markdown: {
        codeStyle: "atom-one-dark",
        markdownOption: {
          bold: true, // 粗体

          defineOpen: "preview",
          // 更多配置
        },
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          htmlcode: true, // 展示html源码
          help: true, // 帮助
          /* 1.3.5 */
          undo: true, // 上一步
          redo: true, // 下一步
          trash: true, // 清空
          save: true, // 保存（触发events中的save事件）
          /* 1.4.2 */
          navigation: true, // 导航目录
          /* 2.1.8 */
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          /* 2.2.1 */
          // subfield:false,
          preview: true, // 预览
        },
      },
      info: {},
      list: [],
      author_name: "",
      article: {},
      markdownForm: {
        id: null,
        title: "",
        content: "",
        uid: 1,
      },

      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { min: 1, max: 80, message: "长度在1到80个字符", trigger: "blur" },
        ],
      },
      lastSaveTime: null,
      timer: null,
    };
  },
  created() {
    this.getArticle();
    this.list = JSON.parse(localStorage.getItem("cglist"));
  },
  mounted() {
    let that = this;
    that.markdown.codeStyle = "atom-one-dark";

    this.timer = setInterval(this.intervalSave, 2 * 60 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    getAid() {
      var aid = this.$route.query.Aid;
      return aid;
    },
    getArticle() {
      // 获取文章内容
      const aid = this.$route.query.Aid;
      const uid = this.$route.query.Uid;
      this.info = this.$route.query.Info;
      console.log(this.info);
      if (this.info == null) {
        if (aid == null) {
          this.markdownForm.content = "";
        } else {
          getMarkdownArticleByAid(aid)
            .then((r) => {
              this.markdownForm.content =
                r.data.content == null ? "" : r.data.content;
              this.markdownForm.id = r.data.id;
              this.markdownForm.title = r.data.title;
              this.markdownForm.uid = this.uid;
              // this.markdownForm.type=r.data.type
            })
            .catch((e) => {
              console.log(e);
            });
        }
      } else {
        this.markdownForm.content = this.info.content;
        this.markdownForm.id = this.info.id;
        this.markdownForm.title = this.info.title;
        this.markdownForm.uid = this.info.uid;
      }
    },
    save() {
      // 保存文章内容
      if (this.markdownForm.title == "") {
        Message("请填写标题");
      } else {
        console.log("保存文章，上传服务器");
        this.markdownForm.uid = localStorage.getItem("uid");
        console.log(this.markdownForm);
        console.log(this.markdownForm, typeof this.markdownForm.id);
        if (
          this.markdownForm.id == null ||
          typeof this.markdownForm.id == "string"
        ) {
          console.log("1");
          this.author_name = localStorage.getItem("username");
          createMarkdownArticle({
            title: this.markdownForm.title,
            content: this.markdownForm.content,
            author_name: this.author_name,
          })
            .then((r) => {
              this.$message.success("创建成功");
              if (this.info) {
                let oldlist = JSON.parse(localStorage.getItem("cglist"));
                let l = this.info;
                let newlist = this.delete(oldlist, l);
                localStorage.setItem("cglist", JSON.stringify(newlist));
              }
              // this.markdownForm.id=r.data.id
              this.lastSaveTime = new Date();
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          saveMarkdownArticle(this.markdownForm)
            .then((r) => {
              this.$message.success("保存成功");
              if (this.info) {
                let oldlist = JSON.parse(localStorage.getItem("cglist"));
                let l = this.info;
                let newlist = this.delete(oldlist, l);
                localStorage.setItem("cglist", JSON.stringify(newlist));
              }
              // this.markdownForm.id=r.data.id
              this.lastSaveTime = new Date();
            })
            .catch((e) => {
              console.log(e);
            });
        }
      }
    },
    intervalSave() {
      // 自动保存
      console.log("时间到了，自动保存");
      /* let now = new Date()
      if(now-this.lastSaveTime>=2*60*1000){
        saveMarkdownArticle(this.markdownForm).then(r => {
          this.$message.success("自动保存成功")
          this.lastSaveTime=new Date()
        }).catch(e => {
          console.log(e)
        })
      }*/
    },
    imgAdd(pos, $file) {
      //添加图片，pos为位置
      let $vm = this.$refs.md;
      console.log($file);
      let base64Data = $file.miniurl; //获取图片base64内容
      let picname = $file.name;
      uploadImg({ picname, base64Data })
        .then((r) => {
          //todo:
          this.$refs.md.$img2Url(
            pos,
            "http://127.0.0.1:3007/images/" + r.picname
          );
        })
        .catch((e) => {
          console.log(e);
        });
    },
    imgDel(pos, url) {
      // 删除图片，并不是修改就会触发，仅支持工具栏操作
    },
    goback() {
      this.$router.push("/example/userlist");
    },
    delete(_arr, info) {
      var length = _arr.length;
      for (var i = 0; i < length; i++) {
        if (_arr[i].id == info.id) {
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
        } else {
          console.log("333333");
        }
      }
    },
    savecg() {
      let oldlist = JSON.parse(localStorage.getItem("cglist"))
        ? JSON.parse(localStorage.getItem("cglist"))
        : [];
      console.log(this.markdownForm.id);
      if (this.info) {
        let l = this.info;
        oldlist = this.delete(oldlist, l);
      }
      this.article["username"] = localStorage.getItem("username");
      this.article["time"] = getDate();
      this.article["uid"] = localStorage.getItem("uid");
      this.article["title"] = this.markdownForm.title;
      if (this.markdownForm.id) {
        console.log(this.markdownForm.id);
        this.article["id"] = this.markdownForm.id;
        console.log(this.article);
      } else {
        this.article["id"] = nanoid();
      }

      this.article["content"] = this.markdownForm.content;
      console.log(this);
      oldlist.push(this.article);
      localStorage.setItem("cglist", JSON.stringify(oldlist));
      this.$router.push({ path: "/example/cglist" });
    },
  },
};
</script>
<style scoped>
.bjq {
  height: 578px;
  width: auto;
}
.app-container {
  padding-top: 20px;
  padding-bottom: 8px;
  margin: auto;
  width: 90%;
  height: 800px;
}

.el-button {
  width: 100px;
  height: 50px;
  border-radius: 25px !important;
  box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9 !important;
  font-weight: 700 !important;
  font-size: 14px !important;
}
</style>
