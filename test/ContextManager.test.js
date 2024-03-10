import { ContextManager } from '../ContextManager.js';
import { test, expect } from 'bun:test';

let contextManager = new ContextManager();

function setup() {
  contextManager = new ContextManager();
  contextManager.addObjects([
    { Person:   { id:  "John",   name: "John"} },
    { Question: { id: "hello",   title: "Hello, {{Person.name}}!" }},
    { Question: { id: "age" ,    title: "What's your age?" }},
    { Question: { id: "adult",   title: "Hello, {{Person.name}}!" }}
  ]);
}


//how do we get contextManager.getObject getValue of Question

test('initial person name is John', () => {
  setup();
  const personName = contextManager.getValue("Person.name");
  expect(personName).toBe("John");
});

test('initial template message is correct', () => {
  setup();

  let hello = contextManager.getObjectById("hello");
  console.log(hello);
  const title = hello.title; //contextManager.getValue("Question.title");

  expect(title).toBe("Hello, John!");
});

// test('updating person name to Jane updates message accordingly', () => {
//   setup();
//   contextManager.setValue("Person.name", "Jane");
//   const personName = contextManager.getValue("Person.name");
//   expect(personName).toBe("Jane");

//   const message = contextManager.getValue("Question.title");
//   expect(message).toBe("Hello, Jane!");
// });

// test('further updating person name to TOTO updates message accordingly', () => {
//   setup();
//   contextManager.setValue("Person.name", "TOTO");
//   const message = contextManager.getValue("Template.message");
//   expect(message).toBe("Hello, TOTO!");
// });

// test('updating person name to Jane updates question title accordingly', () => {
//   setup();
//   contextManager.setValue("Person.name", "Jane");
//   const questionTitle = contextManager.getValue("Question.title");
//   expect(questionTitle).toBe("Hello, Jane!");
// });

// test('further updating person name to TOTO updates question title accordingly', () => {
//   setup(); // Resetting the context for a clean state
//   contextManager.setValue("Person.name", "TOTO");
//   const questionTitle = contextManager.getValue("Question.title");
//   expect(questionTitle).toBe("Hello, TOTO!");
// });