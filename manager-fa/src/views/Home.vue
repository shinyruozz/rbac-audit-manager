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
          <router-view :key="$route.path"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuTree from '../components/MenuTree/index.vue'
import NavTop from '../components/NavTop/index.vue';
import { ref } from 'vue';
import { useStore } from 'vuex'
export default {
  name: "Home",

  data() {
    return {
      isFold: false, //是否折叠
      menuList: this.$store.state.menuList
    };
  },
  computed: {
    defaultActive() {
      return this.$route.path;
    }
  },

  components: {
    MenuTree,
    NavTop
  },
  mounted() {
    console.log(1);
    this.getAuditCount();
    this.getMenuList()
  },
  methods: {
    //获取登录进来用户对应的权限列表 // 管理员默认 全部 普通用户根据分配的角色 获得对应的权限
    async getMenuList() {
      const { menuList, action } = await this.$api.getUserPermission();
      this.menuList = menuList;
    },
    handleFold() {
      this.isFold = !this.isFold
    },
    //获取当前账号需要审批的数量
    async getAuditCount() {
      const count = await this.$api.auditCount();
      this.$store.commit('saveAuditCount', count)
    },
    async getMenuList() {
      try {
        const { menuList, action } = await this.$api.getUserPermission();
        this.$store.commit("saveMenuList", menuList);
        this.$store.commit("saveActionList", action);
        this.menuList = menuList;
      } catch (error) {
        console.error(error);
      }
    },
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
