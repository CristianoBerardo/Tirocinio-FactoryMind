<script>
export default {
  props: {
    message: Object,
    counter: Number,
    incrementCounter: Function,
  },
  methods: {
    tryToMutateProps() {
      // This will cause a Vue warning in development mode
      this.message.value = 'altro' // Tutto ok, è un oggetto
      // this.counter++ // This will trigger a warning
    },
  },
}
</script>

<template>
  <div class="child">
    <h2>Child Component</h2>
    <p>Message from parent: {{ message }}</p>
    <p>Counter: {{ counter }}</p>

    <button @click="tryToMutateProps">Try to mutate props directly</button>
    <button @click="incrementCounter">Call parent function</button>
  </div>
</template>

<style scoped>
h2 {
  color: #42b983;
}
</style>
