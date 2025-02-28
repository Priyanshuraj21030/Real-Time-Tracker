<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from './components/Navbar.vue';
import { useLocationStore } from './stores/locationStore';

const router = useRouter();
const locationStore = useLocationStore();

onMounted(() => {
  // Initialize location tracking
  locationStore.initializeTracking();
});
</script>

<template>
  <div class="app-container">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
}

.main-content {
  flex: 1;
  overflow: auto;
}
</style>