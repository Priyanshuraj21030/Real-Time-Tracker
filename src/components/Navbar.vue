<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeItem = ref('dashboard');

const navigateTo = (route: string, item: string) => {
  activeItem.value = item;
  router.push(route);
};
</script>

<template>
  <nav class="bg-gray-800 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <i class="pi pi-map-marker text-2xl"></i>
        <span class="text-xl font-bold">GeoTracker</span>
      </div>
      
      <div class="hidden md:flex space-x-6">
        <button 
          @click="navigateTo('/', 'home')" 
          class="flex items-center space-x-1 hover:text-blue-300 transition-colors"
          :class="{ 'text-blue-300': activeItem === 'home' }"
        >
          <i class="pi pi-home"></i>
          <span>Home</span>
        </button>
        
        <button 
          @click="navigateTo('/dashboard', 'dashboard')" 
          class="flex items-center space-x-1 hover:text-blue-300 transition-colors"
          :class="{ 'text-blue-300': activeItem === 'dashboard' }"
        >
          <i class="pi pi-map"></i>
          <span>Dashboard</span>
        </button>
        
        <button 
          @click="navigateTo('/settings', 'settings')" 
          class="flex items-center space-x-1 hover:text-blue-300 transition-colors"
          :class="{ 'text-blue-300': activeItem === 'settings' }"
        >
          <i class="pi pi-cog"></i>
          <span>Settings</span>
        </button>
      </div>
      
      <div class="md:hidden">
        <button class="text-white">
          <i class="pi pi-bars text-xl"></i>
        </button>
      </div>
    </div>
  </nav>
</template>