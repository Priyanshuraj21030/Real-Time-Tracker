import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { io, Socket } from 'socket.io-client';

// Types
export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy?: number;
}

// For demo purposes, we'll use mock data and simulate a socket connection
// In a real app, you would connect to a real backend
export const useLocationStore = defineStore('location', () => {
  // State
  const locations = ref<Location[]>([]);
  const userLocation = ref<Location | null>(null);
  const userName = ref<string>('');
  const isTracking = ref<boolean>(false);
  const watchId = ref<number | null>(null);
  const socket = ref<Socket | null>(null);
  const mapCenter = ref<[number, number] | null>(null);

  // Mock data for demonstration
  const mockLocations: Location[] = [
    {
      id: '1',
      name: 'John Doe',
      latitude: 40.7128,
      longitude: -74.0060,
      timestamp: Date.now() - 1000 * 60 * 5
    },
    {
      id: '2',
      name: 'Jane Smith',
      latitude: 34.0522,
      longitude: -118.2437,
      timestamp: Date.now() - 1000 * 60 * 10
    },
    {
      id: '3',
      name: 'Bob Johnson',
      latitude: 51.5074,
      longitude: -0.1278,
      timestamp: Date.now() - 1000 * 60 * 15
    }
  ];

  // Getters
  const activeLocations = computed(() => {
    // Filter locations that were updated in the last hour
    const oneHourAgo = Date.now() - 1000 * 60 * 60;
    return locations.value.filter(loc => loc.timestamp > oneHourAgo);
  });

  // Actions
  function initializeTracking() {
    // In a real app, connect to your socket server
    // socket.value = io('https://your-socket-server.com');
    
    // For demo, we'll just populate with mock data
    locations.value = [...mockLocations];
    
    // Check if geolocation is available
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }
    
    // Get initial location
    navigator.geolocation.getCurrentPosition(
      position => {
        updateUserLocation(position);
      },
      error => {
        console.error('Error getting location:', error);
      }
    );
    
    // Setup mock socket events for demo
    setupMockSocketEvents();
  }
  
  function setupMockSocketEvents() {
    // Simulate receiving location updates
    setInterval(() => {
      // Randomly update one of the mock locations
      const index = Math.floor(Math.random() * mockLocations.length);
      const location = { ...mockLocations[index] };
      
      // Add small random movement
      location.latitude += (Math.random() - 0.5) * 0.01;
      location.longitude += (Math.random() - 0.5) * 0.01;
      location.timestamp = Date.now();
      
      // Update the location
      const locIndex = locations.value.findIndex(l => l.id === location.id);
      if (locIndex >= 0) {
        locations.value[locIndex] = location;
      } else {
        locations.value.push(location);
      }
    }, 10000); // Every 10 seconds
  }
  
  function startTracking() {
    if (isTracking.value) return;
    
    isTracking.value = true;
    
    // Start watching position
    watchId.value = navigator.geolocation.watchPosition(
      position => {
        updateUserLocation(position);
        broadcastLocation();
      },
      error => {
        console.error('Error tracking location:', error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000
      }
    );
  }
  
  function stopTracking() {
    if (!isTracking.value) return;
    
    isTracking.value = false;
    
    // Stop watching position
    if (watchId.value !== null) {
      navigator.geolocation.clearWatch(watchId.value);
      watchId.value = null;
    }
  }
  
  function updateUserLocation(position: GeolocationPosition) {
    userLocation.value = {
      id: 'user',
      name: userName.value || 'You',
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      timestamp: position.timestamp,
      accuracy: position.coords.accuracy
    };
  }
  
  function broadcastLocation() {
    if (!userLocation.value) return;
    
    // In a real app, emit to socket server
    // if (socket.value) {
    //   socket.value.emit('update-location', userLocation.value);
    // }
    
    // For demo, we'll just add to the locations array
    const locIndex = locations.value.findIndex(l => l.id === 'user');
    if (locIndex >= 0) {
      locations.value[locIndex] = { ...userLocation.value };
    } else {
      locations.value.push({ ...userLocation.value });
    }
  }
  
  function setUserName(name: string) {
    userName.value = name;
    if (userLocation.value) {
      userLocation.value.name = name;
    }
  }
  
  function centerMapOn(latitude: number, longitude: number) {
    mapCenter.value = [latitude, longitude];
  }

  return {
    // State
    locations,
    userLocation,
    userName,
    isTracking,
    mapCenter,
    
    // Getters
    activeLocations,
    
    // Actions
    initializeTracking,
    startTracking,
    stopTracking,
    setUserName,
    centerMapOn
  };
});