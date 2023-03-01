<template>
  <div class="app-container">
    <el-table :data="data" style="width: 100%" border>
      <el-table-column prop="data" label="序号" width="60" align="center">
        <template slot-scope="scope"> {{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.title }} </template>
      </el-table-column>
      <el-table-column prop="description" label="描述">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column label="中图预览" align="center">
        <template slot-scope="scope">
          <el-image style="width: 100px" :src="scope.row.midImg" fit="fill">
          </el-image
        ></template>
      </el-table-column>
      <el-table-column label="大图预览" align="center">
        <template slot-scope="scope">
          <el-image style="width: 100px" :src="scope.row.bigImg" fit="fill">
          </el-image
        ></template>
      </el-table-column>
      <el-table-column label="编辑" align="center">
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
              @click="editBannerHandle(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog title="请编辑信息" :visible.sync="dialogFormVisible" top="5vh">
      <el-form :model="form">
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <!-- 首页中图 -->
            <el-form-item label="首页中图">
              <Upload v-model="form.midImg" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 首页大图 -->
            <el-form-item label="首页大图">
              <Upload v-model="form.bigImg" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBannerConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//模板内的prop会自动对应数据内的属性
//slot-scope="scope" 作用域插槽
import { getBanner, setBanner } from "@/api/banner.js";
// import { server_URL } from "@/urlConfig.js";
import Upload from "@/components/Upload.vue";
export default {
  components: {
    Upload,
  },
  data() {
    return {
      data: [], //存储请求到的数据
      form: {
        title: "", //标题
        description: "", //描述
        id: "", //id
        midImg: "", //中图
        bigImg: "", //大图
      },
      dialogFormVisible: false, //是否开启对话框
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getBanner().then((res) => {
        this.data = res.data;
        // for (var item of this.data) {
        //   //图片地址
        //部署到服务器不需要此代码
        //   item.midImg2 = server_URL + item.midImg;
        //   item.bigImg2 = server_URL + item.bigImg;
        //   // console.log(item);
        // }
      });
    },
    editBannerHandle(bannerInfo) {
      // 1. 将 bannerInfo 的数据给 form 2. 打开 dialog
      this.form = { ...bannerInfo };
      this.dialogFormVisible = true;
    },
    editBannerConfirm() {
      //拿到上传的新数据，发送给服务器
      //服务器设置，每次修改数据必须把所以数据全部发送
      let arr = { ...this.form };
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == this.form.id) {
          arr[i] = this.form;
        }
      }
      setBanner(arr).then((res) => {
        this.dialogFormVisible = false; //关闭对话窗口
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.fetchData(); //重新获取数据
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>