import {server, app} from "../src/index";
import supertest from "supertest"; 

//Describe é usado quando nós queremos organizar nossos testes em módulos. É organização basicamente. 
//O teste em si é especificado pela função it ou test. A documentação do jest declara que eles são a mesma cois.
//o que pode mudar é a sua preferência ou a legibilidade do código
//Portanto, nós podemos ver vários describes dedicados a várias áreas do nosso código onde cada describe comporta 
//testes do contexto que aquele describe descreve.
describe("Method CreateUser", () => {
  it('POST', (done) => {

    const data = {
      cpf: "12346578955",
      name: "Raphael"
    }

    supertest(app).post("/account").send(data).expect(201, done)
  })
});

afterAll((done) => {
  server.close();
  done(); 
})