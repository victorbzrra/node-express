import {createUser, usersBD, server} from "../src/index";

describe("CreateUser Method: ", () => {  
  test("Test CPF not handled", () => {
    expect(createUser("123.789.987-90", "Paulinho da esquina")).toBe(usersBD.length);
  });

  test("Test succeeded", () => {
    expect(createUser("12378998790", "Paulinho da esquina")).toBe(usersBD.length);
  })
})

afterAll((done) => {
  server.close();
  done();
});