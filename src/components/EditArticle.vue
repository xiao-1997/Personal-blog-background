<template>
  <div class="app-container">
    <!-- 文章标题 -->
    <div class="block">文章标题</div>
    <div style="margin-bottom: 15px">
      <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
    </div>
    <!-- 文章编辑 -->
    <div class="block">文章编辑</div>
    <div>
      <Editor
        ref="toastuiEditor"
        :initialValue="form.editorText"
        height="600px"
        :options="editorOptions"
      />
    </div>

    <!-- 文章描述 -->
    <div class="block">文章描述</div>
    <el-input
      type="textarea"
      v-model="form.description"
      placeholder="请输入文章描述"
      :rows="6"
    ></el-input>

    <!-- 上传图片 -->
    <Upload uploadTitle="文章图片" v-model="form.thumb" />

    <!-- 选择分类 -->
    <!-- 在input标签内 -->
    <div class="block">选择分类</div>
    <el-select
      v-model="form.select"
      slot="prepend"
      placeholder="请选择文章分类"
    >
      <el-option
        v-for="item in blogType"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      ></el-option>
    </el-select>

    <!-- 发布按钮 -->
    <div>
      <el-button
        type="primary"
        style="margin-top: 15px"
        @click="addArticleHandle"
        >{{ btnContent }}</el-button
      >
    </div>
  </div>
</template>

<script>
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/vue-editor";
import Upload from "@/components/Upload.vue";
import { getBlogType } from "@/api/blogType.js"; //拿到分类
import { addBlog, editBlog, findOneBlog } from "@/api/blog.js"; //添加文章
import "@toast-ui/editor/dist/i18n/zh-cn"; ////Markdown的语言为中文

export default {
  props: ["mode"],
  data() {
    return {
      id: null, //记录修改文章的ID
      form: {
        title: "", //文章标题，输入的内容
        editorText: "", //文章编辑，输入的内容
        description: "", //文章描述
        thumb: "", //文章图片
        select: "", //选择分类
      },
      blogType: [], // 存放博客分类
      editorOptions: {
        language: "zh-CN", //Markdown的语言为中文
      },
      btnContent: "发布文章",
    };
  },
  created() {
    //每进入一次该页面，拿取一次分类数据
    getBlogType().then((res) => {
      this.blogType = res.data;
    });

    //如果编辑页面
    if (this.mode === "edit") {
      //拿到要编辑的文章信息
      this.id = this.$route.params.id;
      findOneBlog(this.id).then(({ data }) => {
        this.form = data;
        this.form.select = data.category === null ? "" : data.category.id;
        //在toast-ui中html，与Markdown的文本需要单独设置
        this.$refs.toastuiEditor.invoke("setHTML", data.htmlContent);
        // console.log(this.form);
      });
      this.btnContent = "确认修改";
    }
  },
  components: {
    Editor,
    Upload,
  },
  methods: {
    addArticleHandle() {
      // 添加文章的业务逻辑 1. 获取表单内容   2. 发送请求

      //在toast-ui中获取html，与Markdown的函数
      let html = this.$refs.toastuiEditor.invoke("getHTML");
      let markdown = this.$refs.toastuiEditor.invoke("getMarkdown");

      //需要传给服务器的信息
      let obj = {
        title: this.form.title, //标题
        description: this.form.description, //文章描述
        createDate: new Date().getTime(), //文章生成的时间，时间戳
        categoryId: this.form.select, //文章分类
        // toc 传递一个空数组过去，之后在服务器根据 markdown 的内容来生成 toc 目录
        toc: [],
        htmlContent: html, //在toast-ui中获取的Markdown的html
        thumb: this.form.thumb, //图片地址
        markdownContent: markdown, //服务器根据这个生成toc目录
      };
      // console.log(obj);

      if (obj.title && obj.description && obj.categoryId) {
        if (this.mode === "add") {
          //添加文章页面
          //图片不是必填项
          addBlog(obj).then(() => {
            //添加完成，跳转回文章列表页
            this.$router.push("/blogList");
          });
        } else {
          //修改页面
          editBlog({ id: this.form.id, data: obj }).then(() => {
            //添加完成，跳转回文章列表页
            this.$router.push("/blogList");
            this.$message.success("修改成功");
          });
        }
      } else {
        this.$message.error("请填写所有内容");
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
</style>