<template>
  <div class="app-container">
    <!-- 表格 -->
    <el-table :data="data" style="width: 100%" border>
      <el-table-column prop="data" label="序号" width="60" align="center">
        <template slot-scope="scope">
          {{ scope.$index + (currentPage - 1) * eachPage + 1 }}</template
        >
      </el-table-column>
      <el-table-column prop="title" label="文章名称" align="center">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="博客预览图"
            width="230"
            trigger="hover"
          >
            <el-image
              style="width: 200px"
              :src="scope.row.thumb"
              fit="content"
              :preview-src-list="srcList"
            ></el-image>
            <a
              href="#"
              target="_blank"
              @click.prevent="goToTitleHandle(scope.row)"
              slot="reference"
              >{{ scope.row.title }}</a
            >
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="文章描述" align="center">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="浏览数"
        width="150"
        align="center"
      >
        <template slot-scope="scope">{{ scope.row.scanNumber }}</template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="评论量"
        width="150"
        align="center"
      >
        <template slot-scope="scope">{{ scope.row.commentNumber }}</template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="所属分类"
        width="150"
        align="center"
      >
        <template slot-scope="scope">{{
          scope.row.category === null ? "文章未分类" : scope.row.category.name
        }}</template>
      </el-table-column>
      <el-table-column prop="description" label="创建时间" align="center">
        <template slot-scope="scope">{{ scope.row.createDate }}</template>
      </el-table-column>
      <el-table-column label="编辑" width="150" align="center">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="editBlogHandle(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="deleteBlog(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      style="margin-top: 30px"
      background
      layout="prev, pager, next, total, ->, sizes, jumper"
      :total="count"
      :page-size="eachPage"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      @prev-click="prevClickHandle"
      @next-click="nextClickHandle"
    >
    </el-pagination>
  </div>
</template>

<script>
import { findBlog, delOneBlog } from "@/api/blog.js";
import { formatDate } from "@/utils/tools.js";
// import { server_URL, frontEnd_URL } from "@/urlConfig.js";
export default {
  data() {
    return {
      data: [], //存储请求到的数据
      srcList: [], //预览图片的链接地址
      eachPage: 5, // 每一页显示的文章数
      currentPage: 1, // 当前页码，默认进来是第一页
      totalPage: 0, // 总页数
      count: 0, // 数据总条数
      pagerCurrentPage: 1, // 分页栏当前页码
    };
  },
  created() {
    //请求数据
    this.fetchData();
  },
  methods: {
    fetchData() {
      findBlog(this.currentPage, this.eachPage).then(({ data }) => {
        //{ data }解构
        this.data = data.rows;

        for (let i of this.data) {
          // console.log(i);
          //处理时间
          i.createDate = formatDate(i.createDate);
          //部署到服务器不需要此代码
          // i.thumb = server_URL + i.thumb; //把图片的服务器地址，加上网址
          this.srcList.push(i.thumb); //把图片链接放入预览图中
        }
        //数据总条数=服务器返回的总条数
        this.count = data.total;
        //总页数=服务器返回的总条数 / 每一页显示的条数 向上取整
        this.totalPage = Math.ceil(this.count / this.eachPage);

        //删除当前页最后一条数据时，当前页码数大于总页数
        if (this.currentPage > this.totalPage) {
          this.currentPage = this.totalPage;
          this.fetchData();
        }
        // console.log(this.data);
      });
    },
    //跳转到选择的新页面
    goToTitleHandle(blogInfo) {
      // window.open(`${frontEnd_URL}/articles/${blogInfo.id}`);
      //部署到服务器不需要此代码 frontEnd_URL
      window.open(`/articles/${blogInfo.id}`);
    },

    //编辑文章
    editBlogHandle(blogInfo) {
      this.$router.push(`/editBlog/${blogInfo.id}`);
    },

    //删除文章
    deleteBlog(blogInfo) {
      //this.$confirm
      this.$confirm(
        "此操作将永久删除该文章内容与评论, 是否继续?",
        "是否删除该文章",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          delOneBlog(blogInfo.id).then(() => {
            //删除成功后，重新获取数据
            this.fetchData();
            //删除成功后，提示删除成功
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //分页事件
    sizeChangeHandle(pageNum) {
      //每页显示的文章数改变时触发
      // 触发时当前页容量会当作参数传进来
      this.eachPage = parseInt(pageNum);
      // 重新跳回第一页
      this.currentPage = 1;
      //重新请求数据同时刷新页面
      this.fetchData();
    },
    currentChangeHandle(pageNum) {
      // 跳转页面时触发,解析字符串并返回整数
      this.currentPage = parseInt(pageNum);
      this.fetchData();
    },
    prevClickHandle() {
      // 用户点击上一页按钮改变当前页后触发
      this.currentPage--;
    },
    nextClickHandle() {
      // 用户点击下一页按钮改变当前页后触发
      this.currentPage++;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>