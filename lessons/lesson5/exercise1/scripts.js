const defaultValues = {
  counter: 10,
  constFirstName: "(Inserisci nome e cognome)",
  constLastName: "(Inserisci nome e cognome)",
  namePlaceholder: "Inserisci nome",
  surnamePlaceholder: "Inserisci cognome",
};

function ref(initialValue) {
  let value = initialValue;
  const subscribers = [];

  return {
    get value() {
      return value;
    },
    set value(newValue) {
      if (value !== newValue) {
        value = newValue;
        subscribers.forEach((callback) => callback(value));
      }
    },
    subscribe(callback) {
      callback(value);
      subscribers.push(callback);
    },
  };
}

const counter = ref(defaultValues.counter);

counter.subscribe((value) => {
  document.getElementById("contatore").innerText = value;
});

document.getElementById("incButton").addEventListener("click", () => {
  counter.value++;
});

document.getElementById("decButton").addEventListener("click", () => {
  counter.value--;
});

document.getElementById("resetButton").addEventListener("click", () => {
  counter.value = defaultValues.counter;
});

function computed(subscribers, getter) {
  const result = ref(getter());

  subscribers.forEach((subscriber) => {
    subscriber.subscribe(() => {
      result.value = getter();
    });
  });

  return result;
}

const firstName = ref("");
const lastName = ref("");

document.getElementById("firstName").addEventListener("input", (event) => {
  firstName.value = event.target.value;
});

document.getElementById("lastName").addEventListener("input", (event) => {
  lastName.value = event.target.value;
});

const fullName = computed([firstName, lastName], () => {
  return `${firstName.value} ${lastName.value}`.trim();
});

fullName.subscribe((value) => {
  document.getElementById("fullName").textContent =
    value || defaultValues.constFirstName;
});

const reversedName = computed([firstName, lastName], () => {
  return fullName.value.split("").reverse().join("");
});

reversedName.subscribe((value) => {
  document.getElementById("reversedName").textContent =
    value || defaultValues.constLastName;
});

document
  .getElementById("resetButtonName")
  .addEventListener("click", (event) => {
    firstName.value = "";
    lastName.value = "";

    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";

    document
      .getElementById("firstName")
      .setAttribute("placeholder", defaultValues.namePlaceholder);

    document
      .getElementById("lastName")
      .setAttribute("placeholder", defaultValues.surnamePlaceholder);
  });
