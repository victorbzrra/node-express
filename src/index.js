const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

const customers = [];

function getBalance(statement) {
  return statement.reduce((acc, operation) => {
    if (operation.type === "credit") {
      return acc + operation.amount;
    } else {
      return acc - operation.amount;
    }
  }, 0);
}

function verifyIfExistsAccount(request, response, next) {
  const { cpf } = request.headers;
  const customer = customers.find((customer) => cpf === customer.cpf);

  if (!customer) {
    return response.status(400).json({ error: "Customer not found!" });
  }

  request.customer = customer;

  return next();
}

const createUser = (cpf, name) => {
  if (customers.some((customer) => cpf === customer.cpf)) {
    return response.status(400).json({ error: "Customer already exists!" });
  }

  return customers.push({ id: uuidv4(), name, cpf, statement: [] });
};

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  createUser(cpf, name);

  return response.status(201).send();
});

app.get("/statement", verifyIfExistsAccount, (request, response) => {
  const { customer } = request;

  return response.json(customer.statement);
});

app.post("/deposit", verifyIfExistsAccount, (request, response) => {
  const { customer } = request;
  const { description, amount } = request.body;

  customer.statement.push({
    amount,
    description,
    created_at: new Date(),
    type: "credit",
  });

  return response.status(201).send();
});

app.post("/withdraw", verifyIfExistsAccount, (request, response) => {
  const { customer } = request;
  const { amount } = request.body;

  if (getBalance(customer.statement)) {
    return response.status(400).json({ error: "Insufficient founds!" });
  }

  customer.statement.push({
    amount,
    created_at: new Date(),
    type: "debit",
  });

  return response.status(201).send();
});

app.get("/statement/date", verifyIfExistsAccount, (request, response) => {
  const { customer } = request;
  const { date } = request.query;

  const dateFormat = new Date(date + " 00:00");

  const statement = customer.statement.filter((statement) => {
    statement.created_at.toDateString() === new Date(dateFormat).toDateString();
  });

  return response.json(statement);
});

app.put("/account", verifyIfExistsAccount, (request, response) => {
  const { customer } = request;
  const { name } = request.body;

  customer.name = name;

  return response.status(201).send();
});

app.get("/account", verifyIfExistsAccount, (request, response) => {
  const { customer } = request;

  return response.json(customer);
});

app.delete("/account", verifyIfExistsAccount, (request, response) => {
  const { customer } = request;

  customers.splice(customer, 1);

  return response.status(200).json(customers);
});

app.get("/balance", verifyIfExistsAccount, (request, response) => {
  const { customer } = request;

  return response.json(getBalance(customer.statement));
});

app.listen(3333);

module.exports = { createUser, customers };
