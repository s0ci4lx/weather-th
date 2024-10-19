<script setup>
import { ref, watchEffect, onMounted } from 'vue'
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
</script>
<template>

  <main>
    <RouterView />
  </main>

</template>