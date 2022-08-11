<template>
  <div class="home-layout">
    <div class="home-commom">
      <div class="menu-wrap" :style="{ width: isFold ? 0 : '200px' }">
        <el-scrollbar>
          <div class="logo-wrap">
            <div class="img-wrap">
              <img src="./../assets/images/logo.png" alt srcset />
            </div>
            <span class="logo-tt">Manager</span>
          </div>
          <el-menu :unique-opened="true" background-color="#001529" router text-color="#fff"
            :default-active="defaultActive">
            <menu-tree :menuList="menuList"></menu-tree>
          </el-menu>
        </el-scrollbar>
      </div>
      <div class="content-right">
        <!-- 头部导航 -->
        <nav-top @fold="handleFold"></nav-top>
        <div class="main-content">
          <router-view :key="this.$route.path"></router-view>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuTree from '../components/MenuTree/index.vue'
import Navtop from '../components/NavTop/index.vue';
import NavTop from '../components/NavTop/index.vue';
export default {
  name: "Home",
  data() {
    return {
      defaultActive: '',
      menuList: [],
      isFold: false, //是否折叠
    };
  },
  computed: {
    defaultActive() {
      console.log(this.$route.path);
      return this.$route.path;
    }
  },

  components: {
    MenuTree,
    Navtop,
    NavTop
  },
  mounted() {
    this.getMenuList();
  },
  methods: {
    async getMenuList() {
      const menuList = await this.$api.getMenuList();
      this.menuList = menuList;
    },
    handleFold() {
      this.isFold = !this.isFold
      console.log(this.isFold);
    }
  },
};
</script>

<style scoped lang='scss'>
.home-layout {
  width: 100vw;
  height: 100vh;

  .home-commom {
    display: flex;
    width: 100%;
    height: 100%;
  }

  .menu-wrap {
    width: 200px;
    height: 100%;
    background-color: #001529;
    overflow: hidden;
    color: #fff;
    transition: width .5s;

    .el-menu {
      border-right: none;
    }

    .el-scrollbar {
      width: 100%;
    }

    .logo-wrap {
      display: flex;
      align-items: center;
      padding: 10px 20px;

      .img-wrap {
        width: 35px;
        height: 35px;
        margin-right: 20px;
      }
    }
  }


  .main-content {
    width: 100%;
    height: calc(100vh - 55px);
    background-color: #eef0f3;
  }

  .content-right {
    min-width: 0;
    flex: 1;

  }
}
</style>
