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
  constructor(id, status = "") {
    this.id = id;
    this.status = status;
  }
}
let message = new Message("message");
ruleEngine.addFact(message);

const ruleSet = [
  {
    name: "HighTemperatureAlert",
    condition: (fact) => fact.type === "TemperatureSensor" && fact.temperature > 30,
    action: (fact) => {
      const message = ruleEngine.facts['message']; // getting 'message' with the ID/key for the Message object
      message.status = `It's really hot. Current temperature is ${fact.temperature}°C on sensor ${fact.id}`;
    }
  },
  {
    name: "FreezingTemperatureAlert",
    condition: (fact) => fact.type === "TemperatureSensor" && fact.temperature <= 0,
    action: (fact) => {
      const message = ruleEngine.facts['message'];
      message.status = `It's freezing. Current temperature is ${fact.temperature}°C on sensor ${fact.id}`;
    },
  },
  {
    name: "NormalTemperatureAlert",
    condition: (fact) => fact.type === "TemperatureSensor" && fact.temperature >= 10 && fact.temperature <= 25,
    action: (fact) => {
      const message = ruleEngine.facts['message'];
      message.status = "Temperature has normalized. 10 ≤ T ≤ 25";
    }
  }
,
  {
    name: "MessageChangeAlert",
    condition: (fact) => fact instanceof Message && fact.status !== "",
    action: (fact) => console.log("📖 => Rule: MessageChangeAlert: " + fact.status),
  },
  {
    name: "TemperatureFluctuationAlert",
    condition: (fact) => fact.id === "message" && (fact.status.includes("hot") || fact.status.includes("freezing")),
    action: (fact) => {
      // This rule aims to check if there was a rapid change in temperature conditions.
      // However, given the current design of the RuleEngine, it might not effectively handle or recognize
      // the sequence of temperature changes if they happen within a single evaluation cycle.
      console.log(`🚨 => Rule: TemperatureFluctuationAlert: Detected rapid temperature change in messages: "${fact.status}"`);
    }
  }
];

ruleSet.forEach(rule => {  ruleEngine.addRule(rule);});

sensor.temperature = 31;
ruleEngine.updateFact(sensor);

sensor.temperature = 0;
ruleEngine.updateFact(sensor);

sensor.temperature = 20;
ruleEngine.updateFact(sensor);