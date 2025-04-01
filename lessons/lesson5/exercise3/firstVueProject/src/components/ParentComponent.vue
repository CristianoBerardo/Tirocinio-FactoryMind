<script>
import ChildComponent from './ChildComponent.vue'

export default {
  components: {
    ChildComponent,
  },
  data() {
    return {
      message: 'Hello from parent',
      counter: 0,
    }
  },
  methods: {
    incrementCounter() {
      this.counter++
      console.log('Counter incremented from parent function')
    },
  },
}
</script>

<template>
  <div>
    <h2>Parent Component</h2>
    <p>Counter: {{ counter }}</p>
    <ChildComponent :message="message" :counter="counter" :incrementCounter="incrementCounter" />
  </div>
</template>


<style scoped>
h2 {
  color: #42b983;
}

div {
  margin-top: 50px;
}
</style>
