import { ContextManager } from '../ContextManager.js';
let contextManager = new ContextManager();
contextManager.addObjects([
  { Person:   { id:  "John",   name: "John"} },
  { Question: { id: "adult",   title: "Hello, {{Person.name}}!" }},
  { Question: { id: "hello",   title: "Hello, {{Person.name}}!" }},
  { Question: { id: "age" ,    title: "What's your age {{Person.name}}?" }},
]);
let hello = contextManager.getObjectById("adult");
console.log(hello);
const title = hello.title; //contextManager.getValue("Question.title");
console.log(title);
//expect(title).toBe("Hello, John!");