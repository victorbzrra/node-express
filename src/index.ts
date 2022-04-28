import express from "express";
import { v4 as uuidv4 } from "uuid";
import { user } from "./Interfaces/user";

export const app = express();

app.use(express.json());

export let usersBD: user[] = [];

export const createUser = (cpf: string, name: string) => {
  let isnum = /^\d+$/.test(cpf);

  if (!isnum) {
    throw {Error: "Tax is invalid"};
  }

  if(usersBD.some((customer) => cpf === customer.cpf)) {
    throw {Error: "User already exists"};
  }

  return usersBD.push({ id: uuidv4(), name, cpf });
};

app.post("/account", (request: any, response: any) => {
  const { cpf, name } = request.body;

  try{
    createUser(cpf, name);
    return response.status(201).json(usersBD[usersBD.length-1]);
  }catch(e){
    return response.status(400).json(e)
  }
});
  
export const server = app.listen(3333);