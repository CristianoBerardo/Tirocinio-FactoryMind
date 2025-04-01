<template>
  <div>
    <h2>Watcher Infinite Loop Example</h2>
    <p>Counter: {{ counter }}</p>
    <button @click="startLoop">Start Infinite Loop</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      counter: 0,
    }
  },
  methods: {
    startLoop() {
      // This will trigger the watcher once
      this.counter = this.counter + 1
    },
  },
  watch: {
    counter(newValue, oldValue) {
      console.log('Counter changed from:', oldValue, 'to:', newValue)
      this.counter = this.counter + 1 // This will trigger the watcher again

      // Si stoppa dopo 100 iterazioni
    },
  },
}
</script>

<style scoped>
h2 {
  color: #42b983;
}
div {
  margin-top: 50px;
}
</style>
