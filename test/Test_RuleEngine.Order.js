import { Rule, RuleEngine } from "../engine/RuleEngine";

class Order {
  constructor(id, customer, items) {
    this.id = id;
    this.customer = customer;
    this.items = items;
    this.discounts = [];
  }

  addDiscount(id, description, value, type) {
    this.discounts.push({ id, description, value, type });
  }

  getTotalDiscount() {
    const totalBeforeDiscount = this.getTotalBeforeDiscount();
    let totalDiscountAmount = 0;

    this.discounts.forEach(discount => {
      if (discount.type === "percent") {
        totalDiscountAmount += (totalBeforeDiscount * (discount.value / 100));
      } else if (discount.type === "amount") {
        totalDiscountAmount += discount.value;
      }
    });

    return totalDiscountAmount;
  }

  getTotalBeforeDiscount() {
    return this.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  }

  getTotal() {
    const totalBeforeDiscount = this.getTotalBeforeDiscount();
    const totalDiscountAmount = this.getTotalDiscount();
    return totalBeforeDiscount - totalDiscountAmount;
  }
}


class Customer {
  constructor(id, name, membershipLevel) {
    this.id = id;
    this.name = name;
    this.membershipLevel = membershipLevel; // 'regular', 'gold', 'platinum'
  }
}

class Discount {
  constructor(id, description, applyRule) {
    this.id = id;
    this.description = description;
    this.applyRule = applyRule;
  }
}

class Notification {
  constructor(id, message) {
    this.id = id;
    this.message = message;
  }
}
class Item {
  constructor(id, name, unitPrice, quantity) {
    this.id = id;
    this.name = name;
    this.unitPrice = unitPrice;
    this.quantity = quantity;
  }
}

// Adding items to the order
let items = [new Item("I1", "Laptop", 1000, 1), new Item("I2", "Mouse", 50, 1), new Item("I3", "Keyboard", 50, 1), new Item("I4", "Charger", 50, 1)];

let customer = new Customer("C1", "Alice", "platinum");
let order = new Order("O1", customer, items);
console.log("Initial order total: $" + order.getTotal());

let ruleEngine = new RuleEngine();
ruleEngine.addFact(customer);
ruleEngine.addFact(order);
const ruleSet = [
  {
    name: "PlatinumMemberDiscount",
    condition: (fact) => fact instanceof Order && fact.customer.membershipLevel === "platinum",
    action: (order) => {
      // Adding a specific discount for platinum members
      order.addDiscount("D1", "Platinum Member Discount", 100, "amount");
      console.log("LOG: Applied $100 Platinum Member Discount.");
    }
  },
  {
    name: "Discount for orders over $1000",
    condition: (fact) => fact instanceof Order && fact.getTotalBeforeDiscount() > 1000,
    action: (order) => {
      order.addDiscount("D2", "Large Order Discount", 50, "amount");
      console.log("LOG: Applied $10 for Large Order Discount.");
    }
  },
  {
    name: "OrderNotification",
    condition: (fact) => fact instanceof Order && fact.getTotal() > 0,
    action: (order) => {
      console.log(`LOG: Order ${order.id} for customer ${order.customer.name} has a final total of $${order.getTotal()}.`);
    }
  },
];
ruleSet.forEach((rule) => {
  ruleEngine.addRule(rule);
});

ruleEngine.evaluateRules();
console.log(JSON.stringify(ruleEngine.getExplanations(), null, 2));
//console.log(ruleEngine);
