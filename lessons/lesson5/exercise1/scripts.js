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

    // 4. Process elements with @emit directives
    if (node.nodeType === Node.ELEMENT_NODE) {
      // Process all attributes
      Array.from(node.attributes).forEach((attr) => {
        // Check for emit directives (@emit:event-name)
        if (attr.name.startsWith("@emit:")) {
          const eventName = attr.name.substring(6); // Remove '@emit:'
          const emitValue = attr.value; // This can reference reactive state

          // Add click handler to emit the event
          node.addEventListener("click", () => {
            // Evaluate complex expressions that appear to be function calls
            let payload;

            if (emitValue.includes("createNotification(")) {
              // Extract parameters from the function call
              const match = emitValue.match(
                /createNotification\(['"](.+?)['"],\s*['"](.+?)['"]\)/
              );
              if (match) {
                const type = match[1];
                const message = match[2];
                payload = createNotification(type, message);
              } else {
                console.error("Invalid createNotification format:", emitValue);
              }
            } else if (emitValue && reactiveState[emitValue]) {
              payload = reactiveState[emitValue].value;
            } else {
              // Simple static value
              payload = emitValue;
            }

            console.log(`Emitting event: ${eventName} with payload:`, payload);
            eventBus.emit(eventName, payload);
          });
        }

        // Check for event listeners (@on:event-name)
        if (attr.name.startsWith("@on:")) {
          const eventName = attr.name.substring(4); // Remove '@on:'
          const handlerName = attr.value;

          // Register handler for this event
          eventBus.on(eventName, (payload) => {
            console.log(`Handling event: ${eventName} with payload:`, payload);
            // Call the handler function if it exists
            if (typeof window[handlerName] === "function") {
              window[handlerName](payload);
            }
          });
        }
      });
    }

    // 5. Process all child nodes recursively
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

/**
 * Simple event bus to handle custom events (similar to Vue's $emit)
 */
class EventBus {
  constructor() {
    this.events = {};
  }

  /**
   * Register an event handler
   * @param {string} event - Event name
   * @param {Function} callback - Handler function
   */
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  /**
   * Emit an event with optional payload
   * @param {string} event - Event name
   * @param {any} payload - Data to pass to handlers
   */
  emit(event, payload) {
    const handlers = this.events[event];
    if (handlers) {
      handlers.forEach((handler) => handler(payload));
    }
  }
}

// Create a global event bus
const eventBus = new EventBus();

// Handler function that will be called when the event is emitted
function handleUserAction(payload) {
  console.log("User action received:", payload);
  document.querySelector(
    ".event-receiver"
  ).textContent = `Event received with payload: ${payload}`;
}

// Add this to your scripts
function handleNotification(notificationData) {
  const container = document.getElementById("notifications-container");

  // Clear the "No notifications" message if it's the first notification
  if (container.textContent.trim() === "No notifications yet") {
    container.textContent = "";
  }

  // Create notification element
  const notif = document.createElement("div");
  notif.className = `notification ${notificationData.type}-notification`;
  notif.innerHTML = `
          <span class="notification-time">${notificationData.timestamp}</span>
          <strong>${notificationData.type.toUpperCase()}:</strong> 
          ${notificationData.message}
          <button class="close-btn">&times;</button>
        `;

  // Add notification dismiss functionality
  const closeBtn = notif.querySelector(".close-btn");
  closeBtn.addEventListener("click", () => {
    notif.classList.add("removing");
    setTimeout(() => {
      notif.remove();

      // If no notifications left, show the placeholder
      if (container.children.length === 0) {
        container.textContent = "No notifications yet";
      }
    }, 300);
  });

  // Add to container
  container.appendChild(notif);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notif.parentNode) {
      notif.classList.add("removing");
      setTimeout(() => {
        if (notif.parentNode) {
          notif.remove();

          // If no notifications left, show the placeholder
          if (container.children.length === 0) {
            container.textContent = "No notifications yet";
          }
        }
      }, 300);
    }
  }, 5000);
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

/**
 * Create different types of notifications
 * @param {string} type - The type of notification
 * @param {string} message - The message of the notification
 * @returns {Object} - The notification object
 */
function createNotification(type, message) {
  const notification = {
    id: Date.now(),
    type,
    message,
    timestamp: new Date().toLocaleTimeString(),
  };
  return notification;
}

// Initialize the application when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Process the entire document to find and handle all template expressions
  processTemplate(document.body, state);
});
