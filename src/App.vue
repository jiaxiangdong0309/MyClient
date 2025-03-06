<template>
  <div class="container">
    <header>
      <h1>{{ title }}</h1>
    </header>
    <main>
      <HelloWorld msg="欢迎使用 Vue 3!" />
    </main>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
  data() {
    return {
      title: "Vue 3 应用",
    };
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

header {
  margin-bottom: 2rem;
  text-align: center;
}

h1 {
  color: #41b883;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

main {
  width: 100%;
}
</style>
