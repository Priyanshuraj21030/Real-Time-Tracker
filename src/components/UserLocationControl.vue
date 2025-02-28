<script setup lang="ts">
import { ref } from 'vue';
import { useLocationStore } from '../stores/locationStore';

const locationStore = useLocationStore();
const isTracking = ref(locationStore.isTracking);
const userName = ref(locationStore.userName || '');
const error = ref('');
const success = ref('');

const toggleTracking = () => {
  if (isTracking.value) {
    locationStore.stopTracking();
    isTracking.value = false;
    success.value = 'Location tracking stopped';
    setTimeout(() => { success.value = ''; }, 3000);
  } else {
    if (!userName.value.trim()) {
      error.value = 'Please enter your name before starting tracking';
      setTimeout(() => { error.value = ''; }, 3000);
      return;
    }
    
    locationStore.setUserName(userName.value);
    locationStore.startTracking();
    isTracking.value = true;
    success.value = 'Location tracking started';
    setTimeout(() => { success.value = ''; }, 3000);
  }
};

const shareLocation = () => {
  if (!locationStore.userLocation) {
    error.value = 'No location available to share';
    setTimeout(() => { error.value = ''; }, 3000);
    return;
  }
  
  const shareUrl = `https://maps.google.com/?q=${locationStore.userLocation.latitude},${locationStore.userLocation.longitude}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'My Location',
      text: `Check out my location: ${userName.value || 'User'}`,
      url: shareUrl
    }).catch(() => {
      // Fallback to clipboard
      copyToClipboard(shareUrl);
    });
  } else {
    // Fallback to clipboard
    copyToClipboard(shareUrl);
  }
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    success.value = 'Location URL copied to clipboard';
    setTimeout(() => { success.value = ''; }, 3000);
  }).catch(() => {
    error.value = 'Failed to copy location URL';
    setTimeout(() => { error.value = ''; }, 3000);
  });
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <h2 class="text-xl font-bold mb-4 flex items-center">
      <i class="pi pi-map-marker mr-2"></i>
      Your Location
    </h2>
    
    <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">
      <p>{{ error }}</p>
    </div>
    
    <div v-if="success" class="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4">
      <p>{{ success }}</p>
    </div>
    
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Your Name
      </label>
      <input 
        id="username"
        v-model="userName" 
        type="text" 
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Enter your name"
        :disabled="isTracking"
      >
    </div>
    
    <div class="flex flex-col space-y-3">
      <button 
        @click="toggleTracking" 
        class="flex items-center justify-center py-2 px-4 rounded transition-colors"
        :class="isTracking ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'"
      >
        <i :class="isTracking ? 'pi pi-stop-circle' : 'pi pi-play'" class="mr-2"></i>
        {{ isTracking ? 'Stop Tracking' : 'Start Tracking' }}
      </button>
      
      <button 
        @click="shareLocation" 
        class="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
        :disabled="!locationStore.userLocation"
      >
        <i class="pi pi-share-alt mr-2"></i>
        Share Location
      </button>
    </div>
    
    <div v-if="locationStore.userLocation" class="mt-4 p-3 bg-gray-100 rounded">
      <div class="text-sm">
        <div class="font-semibold">Current coordinates:</div>
        <div>Latitude: {{ locationStore.userLocation.latitude.toFixed(6) }}</div>
        <div>Longitude: {{ locationStore.userLocation.longitude.toFixed(6) }}</div>
        <div class="text-xs text-gray-500 mt-1">
          Last updated: {{ new Date(locationStore.userLocation.timestamp).toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
</template>