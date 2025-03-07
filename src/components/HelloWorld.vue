<template>
  <div class="hello">
    <h2>{{ msg }}</h2>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  data() {
    return {

    };
  },
};
</script>

<style scoped>
.hello {
  text-align: center;
  margin-top: 20px;
}


</style>
