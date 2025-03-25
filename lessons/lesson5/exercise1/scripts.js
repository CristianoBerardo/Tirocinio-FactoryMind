// Add some debugging at the start
console.log("Script loading...");

const defaultValues = {
  counter: 10,
  constFirstName: "(Inserisci nome e cognome)",
  constLastName: "(Inserisci nome e cognome)",
  namePlaceholder: "Inserisci nome",
  surnamePlaceholder: "Inserisci cognome",
};

// Global context for expressions
const ctx = {
  Date: Date,
  Math: Math,
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

function computed(subscribers, getter) {
  const result = ref(getter());

  subscribers.forEach((subscriber) => {
    subscriber.subscribe(() => {
      result.value = getter();
    });
  });

  return result;
}

// Find and process all {{ }} expressions in the DOM
function processTemplate(rootElement, reactiveState) {
  const textWalker = document.createTreeWalker(
    rootElement,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let textNode;
  while ((textNode = textWalker.nextNode())) {
    const text = textNode.nodeValue;
    if (text.includes("{{") && text.includes("}}")) {
      processTextNode(textNode, text, reactiveState);
    }
  }

  // Process input event listeners
  const inputs = rootElement.querySelectorAll("input");
  inputs.forEach((input) => {
    const modelExp = input.getAttribute("v-model");
    if (modelExp && reactiveState[modelExp]) {
      input.addEventListener("input", (event) => {
        reactiveState[modelExp].value = event.target.value;
      });

      // Initial value
      reactiveState[modelExp].subscribe((value) => {
        input.value = value;
      });
    }
  });

  // Process button clicks
  const buttons = rootElement.querySelectorAll("button");
  buttons.forEach((button) => {
    const clickExp = button.getAttribute("@click");
    if (clickExp && clickExp === "increment") {
      button.addEventListener("click", () => reactiveState.counter.value++);
    } else if (clickExp && clickExp === "decrement") {
      button.addEventListener("click", () => reactiveState.counter.value--);
    } else if (clickExp && clickExp === "reset") {
      button.addEventListener(
        "click",
        () => (reactiveState.counter.value = defaultValues.counter)
      );
    } else if (clickExp && clickExp === "resetName") {
      button.addEventListener("click", () => {
        reactiveState.firstName.value = "";
        reactiveState.lastName.value = "";
      });
    }
  });
}

function processTextNode(textNode, text, reactiveState) {
  const expressionRegex = /\{\{(.*?)\}\}/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let hasTimeExpression = false;

  // Break down the text into static and dynamic parts
  while ((match = expressionRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "static",
        text: text.substring(lastIndex, match.index),
      });
    }

    const expression = match[1].trim();
    parts.push({ type: "dynamic", expression });

    // Check if this is a time-based expression
    if (expression.includes("Date.now()")) {
      hasTimeExpression = true;
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "static", text: text.substring(lastIndex) });
  }

  // Create a span to replace the text node
  const container = document.createElement("span");
  textNode.parentNode.replaceChild(container, textNode);

  // Initial render
  updateDynamicContent(container, parts, reactiveState);

  // Set up timer for time-based expressions
  if (hasTimeExpression) {
    setInterval(() => {
      updateDynamicContent(container, parts, reactiveState);
    }, 5000); // Update every 5 seconds instead of every second
  }

  // Subscribe to reactive properties
  Object.keys(reactiveState).forEach((key) => {
    if (reactiveState[key].subscribe) {
      reactiveState[key].subscribe(() => {
        updateDynamicContent(container, parts, reactiveState);
      });
    }
  });
}

function updateDynamicContent(container, parts, reactiveState) {
  let content = "";
  parts.forEach((part) => {
    if (part.type === "static") {
      content += part.text;
    } else {
      content += evaluateExpression(part.expression, reactiveState);
    }
  });
  container.textContent = content;
}

function evaluateExpression(expression, reactiveState) {
  console.log("Evaluating:", expression); // Debug

  // Handle simple property access
  if (
    reactiveState[expression] &&
    reactiveState[expression].value !== undefined
  ) {
    console.log(
      `Found reactive property ${expression} with value:`,
      reactiveState[expression].value
    );
    return reactiveState[expression].value;
  }

  // Handle function calls and other expressions
  try {
    // Date.now is a special case - format as time
    if (expression === "Date.now()") {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    }

    // Create a context with reactive values unwrapped
    const evaluationContext = { ...ctx };
    Object.keys(reactiveState).forEach((key) => {
      if (reactiveState[key] && reactiveState[key].value !== undefined) {
        evaluationContext[key] = reactiveState[key].value;
      }
    });

    // Debug
    console.log("Evaluation context:", evaluationContext);

    // Evaluate the expression
    const func = new Function(
      ...Object.keys(evaluationContext),
      `return ${expression}`
    );
    const result = func(...Object.values(evaluationContext));
    console.log(`Evaluated ${expression} to:`, result);
    return result;
  } catch (e) {
    console.error(`Error evaluating expression: ${expression}`, e);
    return `[Error: ${e.message}]`;
  }
}

// Define reactive state
const state = {
  counter: ref(defaultValues.counter),
  firstName: ref(""),
  lastName: ref(""),
  fullName: "",
  reversedName: "",
};

// Add computed properties
state.fullName = computed([state.firstName, state.lastName], () => {
  return `${state.firstName.value} ${state.lastName.value}`.trim();
});

state.reversedName = computed([state.fullName], () => {
  return state.fullName.value.split("").reverse().join("");
});

// Initialize the app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, processing template with state:", state);
  processTemplate(document.body, state);
});
