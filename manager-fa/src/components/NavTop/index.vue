<template>
  <div class="nav-top">
    <div class="nav-left">
      <el-icon :size="25" class="icon-fold" @click="handleFold">
        <Fold></Fold>
      </el-icon>
      <bread-crumb></bread-crumb>
    </div>
    <div class="user-info">
      <el-badge :is-dot="auditCount > 0" type="danger" @click="handleToApprove">
        <el-icon :size="20">
          <Bell></Bell>
        </el-icon>
      </el-badge>
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userInfo.userName }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>邮箱：{{ userInfo.userEmail }}</el-dropdown-item>
            <el-dropdown-item @click="signOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import BreadCrumb from "./BreadCrumb/index.vue";
import { mapState } from 'vuex'
export default {
  name: "NavTop",
  components: {
    BreadCrumb
  },
  data() {
    return {
      userInfo: this.$storage.getStorage('userInfo') || {},
    };
  },
  methods: {
    handleFold() {
      this.$emit('fold')
    },
    signOut() {
      this.$router.push('/login')
      this.$storage.clearStorage();
      // this.$store.commit('removeMenu')
    },
    handleToApprove() {
      if (!this.auditCount) return;
      this.$router.push('/audit/approve')
    }
  },

  computed: {
    ...mapState(['auditCount'])
  }
};
</script>

<style lang='scss' scoped>
.nav-top {
  display: flex;
  align-items: center;
  height: 55px;
  justify-content: space-between;
  padding: 0 100px 0 15px;
  border-bottom: 1px solid #ccc;

  .nav-left {
    display: flex;
    align-items: center;

    .icon-fold {
      cursor: pointer;
      padding-right: 20px;
    }
  }

  .el-badge {
    margin-right: 28px;
    cursor: pointer;
  }


}
</style>