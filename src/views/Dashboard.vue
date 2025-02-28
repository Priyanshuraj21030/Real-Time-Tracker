<script setup lang="ts">
import MapComponent from '../components/MapComponent.vue';
import LocationList from '../components/LocationList.vue';
import UserLocationControl from '../components/UserLocationControl.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="container mx-auto">
      <h1 class="text-2xl font-bold mb-6">Location Dashboard</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main map area -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 class="text-xl font-bold mb-4 flex items-center">
              <i class="pi pi-map mr-2"></i>
              World Map
            </h2>
            <MapComponent height="600px" :zoom="2" />
          </div>
        </div>
        
        <!-- Sidebar -->
        <div class="space-y-6">
          <UserLocationControl />
          <LocationList />
        </div>
      </div>
    </div>
  </div>
</template>