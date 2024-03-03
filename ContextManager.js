import { ExpressionParser } from "./ExpressionParser.js";
import { ExpressionEvaluator } from "./ExpressionEvaluator.js";
import { DependencyTracker } from "./DependencyTracker.js";

/* context is used for storing the original object structures including templates, 
and workingMemory is for storing evaluated expressions. */
export class ContextManager {
  constructor() {
    this.parser = new ExpressionParser();
    this.dependencyTracker = new DependencyTracker(this);
    this.context = {};
    this.workingMemory = {};
  }

  addObjects(objects) {
    ////console.log("- Adding objects to context:", JSON.stringify(objects, null, 2));
    objects.forEach((object) => {
      const key = Object.keys(object)[0];
      //console.log(`- Object added under key: '${key}' with value:`, object[key]);

      // Directly update the working memory with the object structure
      this.updateWorkingMemory(key, object[key]);

      // add the object to the context
      //console.log("Before adding to context:", JSON.stringify(this.context));
    // Deep copy object to context
    this.context[key] = JSON.parse(JSON.stringify(object[key]));
      //console.log("After adding to context:", JSON.stringify(this.context));

      if (key === "Template") {
        Object.keys(object[key]).forEach((templateKey) => {
          const templateValue = object[key][templateKey];
          // Parse and add dependencies for templates
          const dependentPaths = this.parser.parseDependentPaths(templateValue);
          dependentPaths.forEach((dependentPath) => {
            this.dependencyTracker.addDependency(dependentPath, `Template.${templateKey}`);
          });
        });
      }
    });
    // Immediately re-evaluate dependencies after all objects have been added
    this.reEvaluateDependencies();
  }

  setValue(path, value) {
    //console.log(`- Setting value for ${path} to`, value);
    this.updateWorkingMemory(path, value);
    //console.log(`- setValue: Updated '${path}' to '${value}'. Notifying dependencies...`);
    this.dependencyTracker.notifyChange(path, value);
  }

  updateWorkingMemory(path, value) {
    //console.log(`START: updateWorkingMemory: '${path}' with value '${value}'`);

    const pathParts = path.split(".");
    let target = this.workingMemory;

    // Navigate through or create nested structure up to the second last path part
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (!(part in target)) {
        target[part] = {}; // Initialize as an empty object if not exist
      }
      target = target[part];
    }

    // Update the value at the final part of the path
    target[pathParts[pathParts.length - 1]] = value;
    // this.reEvaluateDependencies();
    //console.log(`updateWorkingMemory: Updated '${path}' with value: ${JSON.stringify(value)}`);
  }

  getValue(path) {
    //console.error(`START getValue() for '${path}'`);
    //console.log(`workingMemory=`, this.workingMemory);
    const pathParts = path.split(".");
    const objectName = pathParts[0];
    let object = this.workingMemory[objectName];
    //console.log(`object name '${objectName}' =`, object);

    let currentPart = object;

    // Iterate through the rest of the pathParts to get the final value
    for (let i = 1; i < pathParts.length; i++) {
      const part = pathParts[i];
      if (currentPart && part in currentPart) {
        currentPart = currentPart[part];
      } else {
        //console.log(`Path '${path}' not found.`);
        return "NOT FOUND";
      }
    }

    //console.log(`getValue returns = '${currentPart}'`);
    return currentPart;
  }

  reEvaluateExpression(expressionKey) {
    //console.log("START reEvaluateExpression, context at start:", JSON.stringify(this.context));
    const templatePathParts = expressionKey.split(".");
    let template = this.context;
    for (const part of templatePathParts) {
      if (template[part] !== undefined) {
        template = template[part];
      } else {
        console.error(`Template for ${expressionKey} not found in context.`);
        return; // Exit if the template path is not found in the context
      }
    }

    if (typeof template === "string") {
      // Evaluate the template directly against the workingMemory
      const newValue = ExpressionEvaluator.evaluate(template, this.workingMemory);
      // Update workingMemory with the new, evaluated value
      this.updateWorkingMemory(expressionKey, newValue);
      //console.log(`Re-evaluated expression: '${expressionKey}' to '${newValue}'`);
    } else {
      console.error(`Template value for ${expressionKey} is not a string.`);
    }
    //console.log("END reEvaluateExpression, context at end:", JSON.stringify(this.context));
    //console.log("END WM = ", JSON.stringify(this.workingMemory, null, 2));
  }

  reEvaluateDependencies() {
    //console.log("START reEvaluate all dependencies...");
    // Log the context before re-evaluating dependencies
    //console.log("Context before re-evaluating dependencies:", JSON.stringify(this.context, null, 2));

    // Iterate over all keys in workingMemory that are templates and re-evaluate them
    let namesOfObjectsInWM = Object.keys(this.workingMemory);
    //console.log("Names Of Objects In the working memory = ", namesOfObjectsInWM);

    namesOfObjectsInWM.forEach((key) => {
      if (key === "Template") {
        // Adjusted from startsWith to equality check
        Object.entries(this.workingMemory[key]).forEach(([templateKey, templateValue]) => {
          //console.log("Before reEvaluateExpression:", JSON.stringify(this.context));
          this.reEvaluateExpression(`${key}.${templateKey}`, templateValue);
          //console.log("After reEvaluateExpression:", JSON.stringify(this.context));
        });
      }
    });
  }
}
