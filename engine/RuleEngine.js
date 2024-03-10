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
    this.factChanges = {}; // Track the last update times
  }

  addFact(object) {
    const proxy = this.createFactProxy(object);
    this.facts[object.id] = proxy;
    this.evaluateRules();
  }
  addRule(rule) {
    this.rules.push(rule);
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
    this.rules.forEach((rule) => {

      Object.values(this.facts).forEach((fact) => {

        const isConditionMet = rule.condition(fact);
      
        if (isConditionMet) {
          //console.error(`Rule Engine.evaluateRules() - rule ${rule.name} evaluated to true.\n\t Fact =  ${fact.constructor.name}\n` , rule, fact);
          rule.action(fact);
        }
      });
    });
    // Reset change flags after evaluation
    this.factChanges = {};
  }
}
