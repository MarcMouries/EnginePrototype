import { Rule, RuleEngine } from "../engine/RuleEngine";

const ruleEngine = new RuleEngine();

class Sensor {
  constructor(id, type, temperature) {
    this.id = id;
    this.type = type;
    this.temperature = temperature;
  }
}

let sensor = new Sensor("sensor1", "TemperatureSensor", 28);

// Add the sensor object as a fact
ruleEngine.addFact(sensor);

// Initialize Message object with initial text
class Message {
  constructor(status = "") {
    this.status = status;
  }
}
let message = new Message();
ruleEngine.addFact(message);

const ruleSet = [
  {
    name: "HighTemperatureAlert",
    condition: (fact) => fact.type === "TemperatureSensor" && fact.temperature > 30,
    action: (fact) => console.log(`It's really hot. Current temperature is ${fact.temperature}°C on sensor ${fact.id}`),
  },
  {
    name: "FreezingTemperatureAlert",
    condition: (fact) => fact.type === "TemperatureSensor" && fact.temperature <= 0,
    action: (fact) => console.log(`It's freezing. Current temperature is ${fact.temperature}°C on sensor ${fact.id}`),
  },
  {
    name: "MessageChangeAlert",
    condition: (fact) => fact.type === "Message" && fact.status !== "",
    action: (fact) => console.log("MessageChangeAlert: " + fact.status),
  }
];

ruleSet.forEach(rule => {  ruleEngine.addRule(rule);});


// Update the sensor's temperature to 31°C
sensor.temperature = 31;
ruleEngine.updateFact(sensor);

sensor.temperature = 0;
ruleEngine.updateFact(sensor);
