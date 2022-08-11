<template>
  <div class="welcome">
    <div class="img-wrap">
      <img src="../assets/images/welcome.png" alt="" />
    </div>
    <h3>欢迎来到后台管理</h3>
  </div>
</template>

<script>
export default {
  name: "Welcome",
};
</script>

<style lang="scss" scoped>
.welcome {
  overflow: hidden;
  height: 100%;
  text-align: center;
  background-color: #fff;

  .img-wrap {
    display: block;
    width: 350px;
    height: 350px;
    margin: 100px auto;
  }

  h3 {
    font-size: 26px;
  }

}
</style>