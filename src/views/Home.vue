<script setup lang="ts">
import { ref } from "vue";

const position = ref<GeolocationPosition | null>(null);
const error = ref<string>("");
const isSharing = ref(false);

const shareLocation = async () => {
  try {
    if (!navigator.geolocation) {
      error.value = "Geolocation is not supported by your browser";
      return;
    }

    isSharing.value = true;
    position.value = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    // Here you would typically send this location to your backend or sharing service
    const locationData = {
      latitude: position.value.coords.latitude,
      longitude: position.value.coords.longitude,
      timestamp: position.value.timestamp,
    };

    // For demo purposes, we'll just create a shareable link
    const shareData = {
      title: "My Location",
      text: "Check out my location!",
      url: `https://maps.google.com/?q=${locationData.latitude},${locationData.longitude}`,
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // Fallback for browsers that don't support the Web Share API
      await navigator.clipboard.writeText(shareData.url);
      alert("Location link copied to clipboard!");
    }
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to share location";
  } finally {
    isSharing.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <div
      class="hero-section bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 px-4"
    >
      <div class="container mx-auto text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          Real-time Location Tracking
        </h1>
        <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Track and share your location with friends and family around the world
          in real-time.
        </p>
        <div class="flex justify-center space-x-4">
          <router-link
            to="/dashboard"
            class="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Get Started
          </router-link>
          <a
            href="#features"
            class="bg-transparent border border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>

    <div id="features" class="py-16 px-4">
      <div class="container mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">Key Features</h2>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="text-blue-500 text-4xl mb-4">
              <i class="pi pi-map-marker"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">Real-time Tracking</h3>
            <p class="text-gray-600">
              Track your location and see others' locations updated in real-time
              on an interactive map.
            </p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="text-blue-500 text-4xl mb-4">
              <i class="pi pi-share-alt"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">Easy Sharing</h3>
            <p class="text-gray-600">
              Share your location with friends and family with just one click.
            </p>
            <button
              @click="shareLocation"
              :disabled="isSharing"
              class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {{ isSharing ? "Sharing..." : "Share My Location" }}
            </button>
            <p v-if="error" class="mt-2 text-red-500 text-sm">{{ error }}</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="text-blue-500 text-4xl mb-4">
              <i class="pi pi-lock"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">Privacy Controls</h3>
            <p class="text-gray-600">
              Control when and with whom you share your location with
              easy-to-use privacy settings.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-gray-50 py-16 px-4">
      <div class="container mx-auto text-center">
        <h2 class="text-3xl font-bold mb-8">Ready to Get Started?</h2>
        <router-link
          to="/dashboard"
          class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors inline-flex items-center"
        >
          Go to Dashboard
          <i class="pi pi-arrow-right ml-2"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>
