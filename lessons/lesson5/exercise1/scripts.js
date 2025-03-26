// Default values for our reactive state
const defaultValues = {
  counter: 10,
  constFirstName: "(Inserisci nome e cognome)",
  constLastName: "(Inserisci nome e cognome)",
  namePlaceholder: "Inserisci nome",
  surnamePlaceholder: "Inserisci cognome",
};

// Global context for expressions - objects available in template expressions
const ctx = {
  Date: Date,
};

/**
 * Creates a reactive reference similar to Vue's ref()
 * @param {any} initialValue - The initial value to store
 * @returns {Object} - A reactive reference object with getter/setter and subscribe method
 */
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
        // Notifica tutti gli abbonati quando il valore cambia
        subscribers.forEach((callback) => callback(value));
      }
    },

    // Add a subscriber function that will be called when value changes
    subscribe(callback) {
      // Call immediately with current value
      callback(value);
      // Store for future notifications
      subscribers.push(callback);
    },
  };
}

/**
 * Creates a computed property similar to Vue's computed()
 * @param {Array} subscribers - Array of reactive refs this computed depends on
 * @param {Function} getter - Function that computes the value
 * @returns {Object} - A reactive reference to the computed value
 */
function computed(subscribers, getter) {
  // Create a reactive ref with the initial computed value
  const result = ref(getter());

  // Set up subscriptions to update when dependencies change
  subscribers.forEach((subscriber) => {
    subscriber.subscribe(() => {
      // Recalculate and update when any dependency changes
      result.value = getter();
    });
  });

  return result;
}

/**
 * Process the DOM to find and handle template expressions and directives
 * @param {Node} rootElement - The root DOM element to process
 * @param {Object} reactiveState - Object containing all reactive properties
 */
function processTemplate(rootElement, reactiveState) {
  // Process all nodes in the DOM recursively
  function walkDOM(node) {
    // 1. Process text nodes containing {{ expressions }}
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue;
      if (text.includes("{{") && text.includes("}}")) {
        processTextNode(node, text, reactiveState);
      }
    }
    // 2. Process inputs with v-model directive
    else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "INPUT") {
      const modelExp = node.getAttribute("v-model");
      if (modelExp && reactiveState[modelExp]) {
        // Two-way binding: DOM to state
        node.addEventListener("input", (event) => {
          reactiveState[modelExp].value = event.target.value;
        });

        // Two-way binding: state to DOM
        reactiveState[modelExp].subscribe((value) => {
          node.value = value;
        });
      }
    }
    // 3. Process buttons with @click directive
    else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "BUTTON") {
      const clickExp = node.getAttribute("@click");

      // Handle different button actions
      if (clickExp === "increment") {
        node.addEventListener("click", () => reactiveState.counter.value++);
      } else if (clickExp === "decrement") {
        node.addEventListener("click", () => reactiveState.counter.value--);
      } else if (clickExp === "reset") {
        node.addEventListener(
          "click",
          () => (reactiveState.counter.value = defaultValues.counter)
        );
      } else if (clickExp === "resetName") {
        node.addEventListener("click", () => {
          reactiveState.firstName.value = "";
          reactiveState.lastName.value = "";
        });
      }
    }

    // 4. Process all child nodes recursively
    for (const childNode of node.childNodes) {
      walkDOM(childNode);
    }
  }

  // Start DOM traversal from the root
  walkDOM(rootElement);
}

/**
 * Process a text node containing template expressions {{ }}
 * @param {Node} textNode - The text node to process
 * @param {string} text - The text content
 * @param {Object} reactiveState - Reactive state object
 */
function processTextNode(textNode, text, reactiveState) {
  const expressionRegex = /\{\{(.*?)\}\}/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let hasTimeExpression = false;

  // Split text into static and dynamic parts
  while ((match = expressionRegex.exec(text)) !== null) {
    // Add preceding static text if any
    if (match.index > lastIndex) {
      parts.push({
        type: "static",
        text: text.substring(lastIndex, match.index),
      });
    }

    // Add the dynamic expression
    const expression = match[1].trim();
    parts.push({ type: "dynamic", expression });

    // Check if this is a time-based expression for auto-updating
    if (expression.includes("Date.now()")) {
      hasTimeExpression = true;
    }

    lastIndex = match.index + match[0].length;
  }

  // Add any remaining static text after the last expression
  if (lastIndex < text.length) {
    parts.push({ type: "static", text: text.substring(lastIndex) });
  }

  // Replace the original text node with a container for dynamic content
  const container = document.createElement("span");
  textNode.parentNode.replaceChild(container, textNode);

  // Initial render of content
  updateDynamicContent(container, parts, reactiveState);

  // Set up auto-updating for time expressions
  if (hasTimeExpression) {
    setInterval(() => {
      updateDynamicContent(container, parts, reactiveState);
    }, 1000); // Update time every second
  }

  // Subscribe to all reactive properties to update when they change
  Object.keys(reactiveState).forEach((key) => {
    if (reactiveState[key].subscribe) {
      reactiveState[key].subscribe(() => {
        updateDynamicContent(container, parts, reactiveState);
      });
    }
  });
}

/**
 * Update the content of a container with dynamic expressions
 * @param {Element} container - The container element
 * @param {Array} parts - Array of static and dynamic parts
 * @param {Object} reactiveState - Reactive state object
 */
function updateDynamicContent(container, parts, reactiveState) {
  let content = "";

  // Combine all parts (static text and evaluated expressions)
  parts.forEach((part) => {
    if (part.type === "static") {
      content += part.text;
    } else {
      // Evaluate dynamic expressions
      content += evaluateExpression(part.expression, reactiveState);
    }
  });

  // Update the DOM
  container.textContent = content;
}

/**
 * Evaluate a template expression and return its value
 * @param {string} expression - The expression to evaluate
 * @param {Object} reactiveState - Reactive state object
 * @returns {string} - The evaluated result as a string
 */
function evaluateExpression(expression, reactiveState) {
  // Handle direct property access (most common case)
  if (reactiveState[expression]) {
    return reactiveState[expression].value !== undefined
      ? reactiveState[expression].value
      : "";
  }

  // Handle function calls and complex expressions
  try {
    // Special case for Date.now() - format as time
    if (expression === "Date.now()") {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    }

    // Prepare context for evaluation by unwrapping reactive values
    const evaluationContext = { ...ctx };
    Object.keys(reactiveState).forEach((key) => {
      if (reactiveState[key] && reactiveState[key].value !== undefined) {
        evaluationContext[key] = reactiveState[key].value;
      }
    });

    // Safely evaluate the expression using Function constructor
    const func = new Function(
      ...Object.keys(evaluationContext),
      `return ${expression}`
    );
    return func(...Object.values(evaluationContext));
  } catch (e) {
    console.error(`Error evaluating expression: ${expression}`, e);
    return `[Error: ${e.message}]`;
  }
}

// Initialize reactive state
const state = {
  counter: ref(defaultValues.counter),
  firstName: ref(""),
  lastName: ref(""),
};

// Add computed properties that depend on reactive refs
state.fullName = computed([state.firstName, state.lastName], () => {
  return `${state.firstName.value} ${state.lastName.value}`.trim();
});

state.reversedName = computed([state.fullName], () => {
  return state.fullName.value.split("").reverse().join("");
});

// Initialize the application when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Process the entire document to find and handle all template expressions
  processTemplate(document.body, state);
});
