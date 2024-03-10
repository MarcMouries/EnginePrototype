export class Rule {
  constructor(name, condition, action) {
    this.name = name;
    this.condition = condition;
    this.action = action;
  }

  evaluate(context) {
    if (this.condition(context)) {
      this.action(context);
    }
  }
}

export class RuleEngine {
  constructor() {
    this.facts = {};
    this.rules = [];
  }

  addFact(object) {
    this.facts[object.id] = object;
    this.evaluateRules();
  }
  addRule(rule) {
    this.rules.push(rule);
  }
  updateFact(object) {
    if (this.facts[object.id]) {
      this.facts[object.id] = object;
      this.evaluateRules();
    } else {
      console.error(`Fact with id ${object.id} does not exist.`);
    }
  }

  evaluateRules() {
    this.rules.forEach((rule) => {
      Object.values(this.facts).forEach((fact) => {
        const isConditionMet = rule.condition(fact);
        if (isConditionMet) {
          rule.action(fact);
        }
      });
    });
  }
}