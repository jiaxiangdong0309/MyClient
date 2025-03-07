<template>
  <div class="settings-container">
    <h2>{{ msg }}</h2>
    <div class="theme-settings">
      <h3>主题设置</h3>

      <div class="preset-colors">
        <div class="color-buttons">
          <button
            v-for="(color, index) in presetColors"
            :key="index"
            :style="{ backgroundColor: color.color }"
            @click="selectPresetColor(color)"
            class="color-btn"
            :class="{ 'selected': selectedColor === color.value }"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { useAppStore } from "../stores/app";
export default {
  name: "Setting",
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedColor: useAppStore().theme,
      presetColors: [
        {
          name: "白色",
          color: "#ffffff",
          value: "light",
        },
        {
          name: "黑色",
          color: "#000000",
          value: "dark",
        },
      ],
    };
  },
  methods: {

    selectPresetColor(color) {
      this.selectedColor = color.value;
      useAppStore().toggleTheme(color.value);
    },
  },
  mounted() {

  },
};
</script>

<style scoped>
.settings-container {
  margin: 0 auto;
  padding: 20px;
}

.theme-settings {
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.color-picker {
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-picker input[type="color"] {
  width: 50px;
  height: 50px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.preset-colors {
  width: 100%;
  margin-top: 20px;
}

.color-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.color-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;

}

.color-btn.selected {
  border: 2px solid #409EFF;
}

.color-btn:hover {
  transform: scale(1.1);
}

h3,
h4 {
  margin: 0;
  color: #333;
}

h4 {
  margin-bottom: 10px;
}
</style>
