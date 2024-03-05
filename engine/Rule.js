export class Rule {
    constructor(condition, action) {
      this.condition = condition; // Function that returns boolean
      this.action = action;       // Function to execute if condition is true
    }
  
    evaluate(context) {
      if (this.condition(context)) {
        this.action(context);
      }
    }
  }