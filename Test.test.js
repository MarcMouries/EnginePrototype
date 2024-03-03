import { ContextManager } from './ContextManager.js';
import { test, expect } from 'bun:test';

let contextManager = new ContextManager();

// Setting up the context manager for tests
function setup() {
  contextManager = new ContextManager(); // Reinitialize to reset the state for each test
  contextManager.addObjects([
    { Template: { message: "Hello, {{Person.name}}!" }    },
    { Person: { name: "John" }    },
    { Question: { name : "question" , title: "Hello, {{Person.name}}!" }}
  ]);
}

test('initial person name is John', () => {
  setup();
  const personName = contextManager.getValue("Person.name");
  expect(personName).toBe("John");
});

test('initial template message is correct', () => {
  setup();
  const message = contextManager.getValue("Template.message");
  expect(message).toBe("Hello, John!");
});

test('updating person name to Jane updates message accordingly', () => {
  setup();
  contextManager.setValue("Person.name", "Jane");
  const personName = contextManager.getValue("Person.name");
  expect(personName).toBe("Jane");

  const message = contextManager.getValue("Template.message");
  expect(message).toBe("Hello, Jane!");
});

test('further updating person name to TOTO updates message accordingly', () => {
  setup();
  contextManager.setValue("Person.name", "TOTO");
  const message = contextManager.getValue("Template.message");
  expect(message).toBe("Hello, TOTO!");
});

test('updating person name to Jane updates question title accordingly', () => {
  setup();
  contextManager.setValue("Person.name", "Jane");
  const questionTitle = contextManager.getValue("Question.title");
  expect(questionTitle).toBe("Hello, Jane!");
});

test('further updating person name to TOTO updates question title accordingly', () => {
  setup(); // Resetting the context for a clean state
  contextManager.setValue("Person.name", "TOTO");
  const questionTitle = contextManager.getValue("Question.title");
  expect(questionTitle).toBe("Hello, TOTO!");
});