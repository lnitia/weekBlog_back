<template>
  <el-card style="margin-bottom: 20px">
    <div slot="header" class="clearfix">
      <span>About me</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <!-- <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <div>Hello</div>
          {{ user.role }}
        </pan-thumb> -->
        <div class="avatar-uploader" @click="onChange">
          <img v-if="imageUrl" :src="  'http://127.0.0.1:3007/images/'+imageUrl" class="avatar" alt />
          <img v-if="!imageUrl" src="@/assets/1.png" class="avatar" alt />
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </div>
        <image-cropper
          v-show="imagecropperShow"
          :key="imagecropperKey"
          :width="300"
          :height="300"
          :pid="uid"
          url='http://127.0.0.1:3007/my/article/uploadpic'
          lang-type="en"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.name }}</div>
        <div class="user-role text-center text-muted" >
         角色： {{ user.role}}
        </div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon icon-class="education" /><span>Education</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            JS in Computer Science from the University of Technology
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon icon-class="skill" /><span>Skills</span>
        </div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            <span>Vue</span>
            <el-progress :percentage="70" />
          </div>
          <div class="progress-item">
            <span>JavaScript</span>
            <el-progress :percentage="18" />
          </div>
          <div class="progress-item">
            <span>Css</span>
            <el-progress :percentage="12" />
          </div>
          <div class="progress-item">
            <span>ESLint</span>
            <el-progress :percentage="100" status="success" />
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import PanThumb from "@/components/PanThumb";
import ImageCropper from "@/components/ImageCropper";


export default {
  components: { PanThumb,ImageCropper },
 
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: "",
          email: "",
          avatar: "",
          role: "",
        };
      },
    },
    uid:{
      type:Number,
      default:null
    }
  },
  data() {
    
    return {
      imagecropperShow: false,
      imagecropperKey: 0,
      imageUrl:"",
     
    };
  },
 created() {
   this.imageUrl=localStorage.getItem("imageUrl")
   if(this.imageUrl===null){
     this.image="1.png"
   }
 },
  methods: {
    cropSuccess(resData) {
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
      this.imageUrl =resData
      localStorage.setItem("imageUrl",resData)
    },
    close() {
      this.imagecropperShow = false;
    },
    onChange(file, fileList) {
      this.imagecropperShow = true;
      var _this = this;
      var event = event || window.event;
      var file = event.target.files[0];
      var reader = new FileReader();
      // 转base64
      reader.onload = function (e) {
        _this.imageUrl = e.target.result; // 将图片路径赋值给src
        console.log(_this.imageUrl);
      };
      reader.readAsDataURL(file);
    },
    handleChange(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
    },

    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
  },
};
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .avatar-uploader {
    border: 1px dashed rgba(119, 119, 119, 0.5);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #fff;
    margin: 0 auto 20px auto;
  }
  .avatar-uploader :hover {
    border-color: #409eff;
    width: 100px;
    height: 100px;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
  
}
</style>
