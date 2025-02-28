<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useLocationStore } from '../stores/locationStore';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Props
const props = defineProps<{
  height?: string;
  zoom?: number;
}>();

// Store
const locationStore = useLocationStore();

// Refs
const mapContainer = ref<HTMLElement | null>(null);
const map = ref<L.Map | null>(null);
const markers = ref<{ [key: string]: L.Marker }>({});

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Initialize map
onMounted(() => {
  if (mapContainer.value) {
    // Create map
    map.value = L.map(mapContainer.value).setView([0, 0], props.zoom || 2);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.value);
    
    // Add markers for existing locations
    updateMarkers();
  }
});

// Clean up
onUnmounted(() => {
  if (map.value) {
    map.value.remove();
  }
});

// Watch for location changes
watch(() => locationStore.locations, updateMarkers, { deep: true });

// Update markers on the map
function updateMarkers() {
  if (!map.value) return;
  
  // Remove old markers
  Object.values(markers.value).forEach(marker => {
    marker.remove();
  });
  
  markers.value = {};
  
  // Add new markers
  locationStore.locations.forEach(location => {
    if (map.value) {
      const marker = L.marker([location.latitude, location.longitude])
        .addTo(map.value)
        .bindPopup(`
          <strong>${location.name || 'User'}</strong><br>
          Last updated: ${new Date(location.timestamp).toLocaleString()}
        `);
      
      markers.value[location.id] = marker;
    }
  });
  
  // Center map on user's location if available
  const userLocation = locationStore.userLocation;
  if (userLocation && map.value) {
    map.value.setView([userLocation.latitude, userLocation.longitude], props.zoom || 13);
  }
}
</script>

<template>
  <div 
    ref="mapContainer" 
    class="map-container" 
    :style="{ height: height || '500px' }"
  ></div>
</template>

<style scoped>
.map-container {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>