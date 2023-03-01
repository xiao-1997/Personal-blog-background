<template>
  <div class="app-container">
    <!-- 项目名称 -->
    <div class="block">项目名称</div>
    <div style="margin-bottom: 15px">
      <el-input v-model="form.name" placeholder="请输入项目的名称"></el-input>
    </div>

    <!-- 项目描述（每一项描述以英文逗号分割） -->
    <div class="block">项目描述（每一项描述以英文逗号分割）</div>
    <div style="margin-bottom: 15px">
      <el-input
        v-model="form.description"
        placeholder="请输入项目描述（每一项描述以英文逗号分割）"
      ></el-input>
    </div>

    <!-- 项目链接 -->
    <div class="block">项目链接</div>
    <div style="margin-bottom: 15px">
      <el-input v-model="form.url" placeholder="请输入项目链接"></el-input>
    </div>

    <!-- github -->
    <div class="block">github</div>
    <div style="margin-bottom: 15px">
      <el-input v-model="form.github" placeholder="请输入github地址"></el-input>
    </div>

    <!-- 预览图 -->
    <div class="block">预览图</div>
    <div style="margin-bottom: 15px">
      <Upload uploadTitle="项目预览图地址" v-model="form.thumb" />
    </div>

    <!-- 项目等级 -->
    <div class="block">项目等级</div>
    <div style="margin-bottom: 15px">
      <el-select v-model="form.order" placeholder="分类等级">
        <el-option label="1" value="1"></el-option>
        <el-option label="2" value="2"></el-option>
        <el-option label="3" value="3"></el-option>
        <el-option label="4" value="4"></el-option>
        <el-option label="5" value="5"></el-option>
      </el-select>
    </div>

    <el-button type="primary" plain @click="addProjectHandle"
      >发布项目</el-button
    >
  </div>
</template>

<script>
import Upload from "@/components/Upload.vue";
import { addProject } from "@/api/project.js";
export default {
  data() {
    return {
      data: [], // 存储用户信息
      form: {
        //要编辑的文章信息
        name: "", //项目名称
        description: "", //项目描述
        url: "", //项目链接
        github: "", //github
        thumb: "", //预览图
        order: 1, //项目等级
      },
    };
  },
  components: {
    Upload,
  },

  methods: {
    addProjectHandle() {
      let obj = { ...this.form };
      //把字符串转换成数字，每一项描述以英文逗号分割
      obj.description = this.form.description.split(",");
      obj.order = parseInt(this.form.order); //转换成纯数字

      // 上传新文章的数据
      addProject(obj).then(() => {
        //添加成功后跳转回项目管理页
        this.$router.push("/projectsList");
        this.$message.success("添加成功"); //提示用户
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.block {
  margin: 15px 0;
  font-weight: 100;
}
</style>