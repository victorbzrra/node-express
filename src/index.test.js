const indexModule = require("./index");

const costumers = indexModule.customers;
const createUser = indexModule.createUser;
test("Verify createUser", () => {
  expect(createUser("12345678910", "Paulinho da esquina")).toBe(
    costumers.length
  );
});

test("asidjasdas", () => {
  expect(createUser(4, "Paulinho da esquina")).toBe(costumers.length);
});
