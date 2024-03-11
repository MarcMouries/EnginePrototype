export class Rule {
  constructor(name, condition, action) {
    this.name = name;
    this.condition = condition;
    this.action = action;
  }

  evaluate(ruleEngine) {
   // console.log("Evaluate: ", this);

    Object.values(ruleEngine.facts).forEach((fact) => {
      if (this.condition(fact)) {
        //console.log("Condition met for: ", this);
        this.action(fact);
          ruleEngine.logExplanation(this, fact);
      }
    });
  }
}

export class RuleEngine {
  constructor() {
    this.facts = {};
    this.rules = [];
    this.factChanges = {}; // Track the last update times
    this.explanations = [];
  }

  addFact(object) {
    const proxy = this.createFactProxy(object);
    this.facts[object.id] = proxy;
    this.evaluateRules();
  }
  addRule(rule) {
    this.rules.push(new Rule(rule.name, rule.condition, rule.action));
  }

  createFactProxy(object) {
    const ruleEngine = this;
    const handler = {
      set: (obj, prop, value) => {
        const changeKey = `${obj.id}_${prop}`;
        //console.log("Proxy: changeKey: " + changeKey);

        // Only trigger evaluation if the new value is different from the current value
        if (obj[prop] !== value) {
          // console.log(`RuleEngine: Fact ${obj.id} property ${prop} changed\n\tprevious value = ${obj[prop]}\n\tnew value = ${value}`);
          // console.log(`RuleEngine: factChanges = `, this.factChanges);
          // console.log(`RuleEngine: facts = `, this.facts);

          // Only proceed if this is a new or updated change
          if (!ruleEngine.factChanges[changeKey]) {
            obj[prop] = value;
            obj._timechanged = Date.now();

            // Mark the fact and property as changed with the current timestamp
            ruleEngine.factChanges[`${obj.id}_${prop}`] = Date.now();
            console.log(`RuleEngine: factChanges = `, this.factChanges);
            //    ruleEngine.evaluateRules();
          }
        }
        return true; // Always return true
      },
    };
    return new Proxy(object, handler);
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
    // Reset explanations at the start of each evaluation cycle
    this.explanations = [];

    // fire all rules
    this.rules.forEach((rule) => {
      rule.evaluate(this);
    });

    // Reset change flags after evaluation
    this.factChanges = {};
  }
  logExplanation(rule, fact) {
    const explanation = {
      rule: rule.name,
      fact: fact.id,
      reason: `Rule "${rule.name}" applied based on condition.`
    };
    this.explanations.push(explanation);
  }

  explain(factId) {
    const fact = this.facts[factId];
    if (!fact) {
      return `No fact found for ID: ${factId}`;
    }
    const explanations = [];
    let currentJustification = fact.justification;
    while (currentJustification) {
      explanations.push(`${currentJustification.reason} This led to the current state due to rule "${currentJustification.rule}".`);
      currentJustification = this.facts[currentJustification.dependencies.shift()].justification;
    }
    return explanations.join("\n");
  }
  getExplanations() {
    return this.explanations;
  }
}
