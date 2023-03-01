<template>
  <div class="app-container">
    <!-- 表格 -->
    <el-table
      :data="data"
      v-loading="listLoading"
      element-loading-text="加载中,请稍等"
      border
      fit
      highlight-current-row
    >
      <!-- 序号 -->
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          {{ scope.$index + (currentPage - 1) * eachPage + 1 }}</template
        >
      </el-table-column>

      <!-- 头像 -->
      <el-table-column label="头像" width="60" align="center">
        <template slot-scope="scope">
          <el-avatar
            shape="square"
            size="small"
            :src="scope.row.avatar"
          ></el-avatar>
        </template>
      </el-table-column>

      <!-- 昵称 -->
      <el-table-column label="昵称" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>

      <!-- 内容 -->
      <el-table-column label="内容" align="center">
        <template slot-scope="scope">{{ scope.row.nickname }}</template>
      </el-table-column>

      <!-- 创建日期 -->
      <el-table-column label="创建日期" align="center">
        <template slot-scope="scope">{{ scope.row.createDate }}</template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
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
              @click="deleteMessage(scope.row)"
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
      :current-page.sync="pagerCurrentPage"
      :page-sizes="[5, 10, 15, 20]"
      @prev-click="prevClickHandle"
      @next-click="nextClickHandle"
      @current-change="currentChangeHandle"
      @size-change="handleSizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getMessages, delMessage } from "@/api/message.js";
import { formatDate } from "@/utils/tools"; //时间戳
export default {
  data() {
    return {
      listLoading: false, //是否处于加载中
      currentPage: 1, // 当前页码
      eachPage: 5, // 每页显示条数
      totalPage: 0, // 总页数
      count: 0, // 数据总条数
      data: [], // 数据详情
      pagerCurrentPage: 1, // 分页栏当前页码
    };
  },
  created() {
    // 请求数据
    this.fetchData();
  },
  methods: {
    //请求数据
    fetchData() {
      this.listLoading = true; //加载中
      getMessages(this.currentPage, this.eachPage).then(({ data }) => {
        this.data = data.rows;
        for (let i of this.data) {
          i.createDate = formatDate(i.createDate);
        }
        this.count = data.total; //计算总数据量
        this.totalPage = Math.ceil(this.count / this.eachPage); //总页数
        if (this.currentPage > this.totalPage) {
          this.currentPage = this.totalPage;
          this.fetchData();
        }
        this.listLoading = false;
      });
    },

    //删除
    deleteMessage({ id }) {
      this.$confirm("是否删除此条留言信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delMessage(id).then(() => {
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
    handleSizeChange(pageNum) {
      //每页显示的文章数改变时触发
      // 触发时当前页容量会当作参数传进来
      this.eachPage = parseInt(pageNum);
      // 重新跳回第一页
      this.currentPage = 1;
      this.pagerCurrentPage = 1;
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