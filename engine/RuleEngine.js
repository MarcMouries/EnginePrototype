class RuleEngine {
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
      // Adjusted to iterate through each fact in facts
      Object.values(this.facts).forEach((fact) => {
        const isConditionMet = rule.condition(fact);
        if (isConditionMet) {
          rule.action(fact);
        }
      });
    });
  }
}


class Rule {
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


const ruleEngine = new RuleEngine();

let sensor = {
    id: "sensor1",
    type: "temperatureSensor",
    temperature: 28 // Initial temperature
};

// Add the sensor object as a fact
ruleEngine.addFact(sensor);

// Define a rule for when the temperature exceeds 30°C
ruleEngine.addRule({
     condition: (fact) => fact.type === "temperatureSensor" && fact.temperature > 30,
     action: (fact) => console.log(`It's really hot. Current temperature is ${fact.temperature}°C on sensor ${fact.id}`)
});
// Define a rule for when the temperature goes below 0°C
ruleEngine.addRule({
  condition: (fact) => fact.type === "temperatureSensor" && fact.temperature <= 0,
  action: (fact) => console.log(`It's freezing. Current temperature is ${fact.temperature}°C on sensor ${fact.id}`)
});
// Update the sensor's temperature to 31°C
sensor.temperature = 31;
ruleEngine.updateFact(sensor);

sensor.temperature = 0;
ruleEngine.updateFact(sensor);
