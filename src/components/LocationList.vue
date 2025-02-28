<script setup lang="ts">
import { computed } from 'vue';
import { useLocationStore } from '../stores/locationStore';

const locationStore = useLocationStore();

const sortedLocations = computed(() => {
  return [...locationStore.locations].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
});

const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString();
};

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString();
};

const getDistanceFromUser = (lat: number, lng: number): string => {
  const userLoc = locationStore.userLocation;
  if (!userLoc) return 'Unknown';
  
  // Calculate distance using Haversine formula
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat - userLoc.latitude);
  const dLon = deg2rad(lng - userLoc.longitude);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(userLoc.latitude)) * Math.cos(deg2rad(lat)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};

const centerOnLocation = (lat: number, lng: number) => {
  locationStore.centerMapOn(lat, lng);
};
</script>

<template>
  <div class="location-list bg-white rounded-lg shadow-md p-4">
    <h2 class="text-xl font-bold mb-4 flex items-center">
      <i class="pi pi-users mr-2"></i>
      Active Locations
    </h2>
    
    <div v-if="sortedLocations.length === 0" class="text-center py-8 text-gray-500">
      <i class="pi pi-map-marker text-4xl mb-2"></i>
      <p>No active locations found</p>
    </div>
    
    <ul v-else class="divide-y divide-gray-200">
      <li v-for="location in sortedLocations" :key="location.id" class="py-3">
        <div class="flex justify-between items-start">
          <div>
            <div class="font-medium">{{ location.name || 'Unknown User' }}</div>
            <div class="text-sm text-gray-500">
              {{ formatDate(location.timestamp) }} at {{ formatTime(location.timestamp) }}
            </div>
            <div class="text-sm text-gray-600 mt-1">
              <span class="inline-flex items-center">
                <i class="pi pi-map-marker mr-1 text-red-500"></i>
                {{ location.latitude.toFixed(6) }}, {{ location.longitude.toFixed(6) }}
              </span>
            </div>
            <div class="text-sm text-gray-600">
              <span class="inline-flex items-center">
                <i class="pi pi-arrows-h mr-1"></i>
                Distance: {{ getDistanceFromUser(location.latitude, location.longitude) }}
              </span>
            </div>
          </div>
          
          <button 
            @click="centerOnLocation(location.latitude, location.longitude)"
            class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            <i class="pi pi-eye mr-1"></i>
            View
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>