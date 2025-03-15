const defaultValues = {
  count: 10,
};

const counterStore = {
  state: Vue.reactive({
    count: defaultValues.count,
  }),

  increment() {
    this.state.count++;
  },

  decrement() {
    this.state.count--;
  },

  reset() {
    this.state.count = defaultValues.count;
  },
};

const CounterDisplay = {
  template: `
                <div class="component">
                    <h2>Contatore Centrale</h2>
                    <div class="counter">{{ count }}</div>
                </div>
            `,
  computed: {
    count() {
      return counterStore.state.count;
    },
  },
};

// Componente con bottone per incrementare
const IncrementerComponent = {
  template: `
                <div class="component incrementer">
                    <h2>Componente Incrementatore</h2>
                    <p>Valore attuale: {{ count }}</p>
                    <button @click="increment" class="increment-btn">Incrementa</button>
                </div>
            `,
  computed: {
    count() {
      return counterStore.state.count;
    },
  },
  methods: {
    increment() {
      counterStore.increment();
    },
  },
};

// Componente con bottone per decrementare
const DecrementerComponent = {
  props: {
    title: {
      type: String,
      default: "Componente Decrementatore",
    },
  },
  template: `
                <div class="component decrementer">
                    <h2>{{ title }}</h2>
                    <p>Valore attuale: {{ count }}</p>
                    <button @click="decrement" class="decrement-btn">Decrementa</button>
                </div>
            `,
  computed: {
    count() {
      return counterStore.state.count;
    },
  },
  methods: {
    decrement() {
      counterStore.decrement();
    },
  },
};

// Creazione dell'app Vue
const app = Vue.createApp({});

// Registrazione dei componenti
app.component("counter-display", CounterDisplay);
app.component("incrementer-component", IncrementerComponent);
app.component("decrementer-component", DecrementerComponent);

// Montaggio dell'app
app.mount("#app");
