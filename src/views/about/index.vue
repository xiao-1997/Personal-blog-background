<template>
  <div class="app-container">
    <div class="block">关于我</div>
    <el-input
      v-model="url"
      placeholder="请输入内容"
      :disabled="isDisabled"
    ></el-input>
    <el-button type="primary" style="margin-top: 15px" @click="clickHandle">{{
      btnContent
    }}</el-button>
  </div>
</template>

<script>
import { getAbout, editAbout } from "@/api/about.js";
export default {
  data() {
    return {
      url: "",
      isDisabled: true, //是否进行进行编辑，默认禁用
      btnContent: "编辑",
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getAbout().then(({ data }) => {
        this.url = data;
      });
    },
    clickHandle() {
      if (this.btnContent == "编辑") {
        this.btnContent = "完成";
        this.isDisabled = false; //可以进行编辑
      } else {
        if (this.url) {
          this.btnContent = "编辑";
          this.isDisabled = true;
          editAbout({ url: this.url }).then(() => {
            // this.fetchData();
          });
        } else {
          //如果进入编辑但是没填url
          this.$message({
            message: "输入框不能为空",
            type: "warning",
          });
        }
      }
    },
  },
};
</script>

<style scoped>
.block {
  margin: 15px 0;
  font-weight: 100;
}
</style>