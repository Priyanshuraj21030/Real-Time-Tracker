<script setup lang="ts">
import { ref } from 'vue';
import { useLocationStore } from '../stores/locationStore';

const locationStore = useLocationStore();
const userName = ref(locationStore.userName || '');
const trackingInterval = ref('30');
const notificationsEnabled = ref(true);
const shareLocationWithFriends = ref(true);
const error = ref('');
const success = ref('');

const saveSettings = () => {
  if (!userName.value.trim()) {
    error.value = 'Please enter your name';
    setTimeout(() => { error.value = ''; }, 3000);
    return;
  }
  
  locationStore.setUserName(userName.value);
  
  // In a real app, you would save these settings to a backend
  success.value = 'Settings saved successfully';
  setTimeout(() => { success.value = ''; }, 3000);
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="container mx-auto max-w-3xl">
      <h1 class="text-2xl font-bold mb-6">User Settings</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">
          <p>{{ error }}</p>
        </div>
        
        <div v-if="success" class="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4">
          <p>{{ success }}</p>
        </div>
        
        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-4">Profile Settings</h2>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="settings-username">
              Your Name
            </label>
            <input 
              id="settings-username"
              v-model="userName" 
              type="text" 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your name"
            >
          </div>
        </div>
        
        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-4">Location Settings</h2>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="tracking-interval">
              Location Update Interval
            </label>
            <select 
              id="tracking-interval"
              v-model="trackingInterval" 
              class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="10">Every 10 seconds</option>
              <option value="30">Every 30 seconds</option>
              <option value="60">Every minute</option>
              <option value="300">Every 5 minutes</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="flex items-center">
              <input type="checkbox" v-model="shareLocationWithFriends" class="mr-2">
              <span class="text-gray-700">Share my location with friends</span>
            </label>
          </div>
        </div>
        
        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-4">Notification Settings</h2>
          
          <div class="mb-4">
            <label class="flex items-center">
              <input type="checkbox" v-model="notificationsEnabled" class="mr-2">
              <span class="text-gray-700">Enable notifications</span>
            </label>
          </div>
        </div>
        
        <div class="flex justify-end">
          <button 
            @click="saveSettings" 
            class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  </div>
</template>