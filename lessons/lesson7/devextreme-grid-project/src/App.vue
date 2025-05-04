<template>
  <div id="app">
    <div class="header">
      <h1>DevExtreme Grids Demo</h1>
      <div class="tabs">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          :class="{ active: activeTab === index }"
          @click="activeTab = index"
        >
          {{ tab.title }}
        </button>
      </div>
    </div>

    <div class="content">
      <component :is="currentTab.component"></component>
    </div>
  </div>
</template>

<script>
import MasterDetailGrid from "./components/MasterDetailGrid.vue";
import ODataGrid from "./components/ODataGrid.vue";
import PopupEditingGrid from "./components/PopupEditingGrid.vue";

export default {
  name: "App",
  components: {
    ODataGrid,
    PopupEditingGrid,
    MasterDetailGrid,
  },
  data() {
    return {
      activeTab: 0,
      tabs: [
        { title: "OData Grid", component: "ODataGrid" },
        { title: "Popup Editing Grid", component: "PopupEditingGrid" },
        { title: "Master-Detail Grid", component: "MasterDetailGrid" },
      ],
    };
  },
  computed: {
    currentTab() {
      return this.tabs[this.activeTab];
    },
  },
};
</script>

<style>
@import "~devextreme/dist/css/dx.light.css";
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfigWithVueTs } from '@vue/eslint-config-typescript';
import ArrayStore from 'devextreme/data/array_store';
import axios from 'axios';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #f8f8f8;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.header h1 {
  margin: 0 0 20px 0;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
}

.tabs button {
  padding: 10px 20px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 16px;
  outline: none;
  transition: all 0.3s;
}

.tabs button.active {
  border-bottom: 3px solid #1976d2;
  color: #1976d2;
  font-weight: bold;
}

.content {
  flex: 1;
  overflow: auto;
  padding: 0;
}
</style>
