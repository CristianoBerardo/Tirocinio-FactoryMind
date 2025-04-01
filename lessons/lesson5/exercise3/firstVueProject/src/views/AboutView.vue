<script>
import ParentComponent from '../components/ParentComponent.vue'
import ChildComponent from '../components/ChildComponent.vue'
</script>

<template>
  <div class="about">
    <ParentComponent />
    <ChildComponent />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
