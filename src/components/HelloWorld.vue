<template>
  <div class="hello">
    <h2>{{ msg }}</h2>
    <div class="card">
      <button type="button" @click="count++">点击次数: {{ count }}</button>
    </div>
    <p>编辑 <code>components/HelloWorld.vue</code> 来测试热更新</p>
    <div class="features">
      <h3>Vue 3 的主要特性:</h3>
      <ul>
        <li v-for="(feature, index) in features" :key="index">
          {{ feature }}
        </li>
      </ul>
    </div>
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
      count: 0,
      features: [
        "更好的性能",
        "更小的包体积",
        "组合式 API",
        "更好的 TypeScript 支持",
        "片段（Fragments）",
        "Teleport 组件",
        "Suspense 组件",
      ],
    };
  },
};
</script>

<style scoped>
.hello {
  text-align: center;
  margin-top: 20px;
}

h2 {
  color: #35495e;
  margin-bottom: 1.5rem;
}

.card {
  padding: 2em;
}

button {
  padding: 0.75em 1.5em;
  font-weight: bold;
  background-color: #41b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #35495e;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}

.features {
  margin-top: 2rem;
  text-align: left;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

h3 {
  margin-bottom: 1rem;
  color: #35495e;
}

ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}

li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}
</style>
