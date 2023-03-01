<template>
  <div>
    <!-- 组件名称 -->
    <div class="block">{{ uploadTitle }}</div>
    <!-- 上传头像 -->
    <div>
      <el-upload
        class="avatar-uploader"
        action="/api/upload"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :headers="headers"
      >
        <img v-if="value" :src="value" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
  </div>
</template>

<script>
// import { server_URL } from "@/urlConfig.js";
export default {
  props: [
    "uploadTitle", //名称
    "value", //数据
  ],
  computed: {
    // imageUrl() {
    //   if (this.value) {
    //如果有传入的值，转向服务器地址
    //部署到服务器不需要此代码
    // return server_URL + this.value;
    //   }
    // },
    headers() {
      return {
        //服务器设置上传图片时需要授权
        //由于上传不走axios，所以需要在上传时添加授权
        Authorization: "Bearer " + localStorage.getItem("adminToken"),
      };
    },
  },
  methods: {
    handleAvatarSuccess(res) {
      //上传成功的回调函数，组件库设置
      //res返回的数据是图片在服务器的地址
      if (!res.code && res.data) {
        this.$emit("input", res.data);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.block {
  margin: 15px 0;
  font-weight: 100;
}
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>