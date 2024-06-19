// const express = require("express");
// const axios = require("axios");

import express from "express";
import axios from "axios";

const app = express();
const port = 9876;

app.use(express.json());

// let windowPrevState = [];
// let windowCurrState = [];
let numberWindow = new Set();
let windowSize = 10;
const BASE_URL = "http://20.244.56.144/test";
const BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE4Nzc4OTAyLCJpYXQiOjE3MTg3Nzg2MDIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjMzMDA0NDMyLWRiNWUtNGQzOC1hYWVlLWQ1NmFmNWEwMDg2YiIsInN1YiI6IjIxMDMwNTEwNTQ1M0BwYXJ1bHVuaXZlcnNpdHkuYWMuaW4ifSwiY29tcGFueU5hbWUiOiJwcmF0aWtNYXJ0IiwiY2xpZW50SUQiOiIzMzAwNDQzMi1kYjVlLTRkMzgtYWFlZS1kNTZhZjVhMDA4NmIiLCJjbGllbnRTZWNyZXQiOiJ3QU5FemZ6aVh0QkZrdEVPIiwib3duZXJOYW1lIjoiUHJhdGlrIFRoYWt1ciIsIm93bmVyRW1haWwiOiIyMTAzMDUxMDU0NTNAcGFydWx1bml2ZXJzaXR5LmFjLmluIiwicm9sbE5vIjoiMjEwMzA1MTA1NDUzIn0.bZvVm737HZ2tW5qflFhh-XrHq3wCtJfEb4q6up7f6NA";

const getNumbers = async (id) => {
  let type = "";
  switch (id) {
    case "p":
      type = "primes";
      break;
    case "f":
      type = "Fibo";
      break;
    case "e":
      type = "even";
      break;
    case "r":
      type = "rand";
      break;
    default:
      throw new Error("Invalid Type");
  }

  const response = await axios.get(`${BASE_URL}/type`, {
    timeout: 500,
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
  });
  return response.data.numbers;
};

const getAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  const sum = Array.from(numbers).reduce((s, num) => s + num, 0);
  return (sum / numbers.size).toFixed(2);
};

app.get("/numbers:id", async (req, res) => {
  const id = req.params.id;
  if (!["p", "f", "e", "r"].includes(id)) {
    res.status(400).send({ error: "Invalid ID" });
  }

  const prevState = Array.from(numberWindow);
  const newNumbers = await getNumbers(id);

  newNumbers.array.forEach((num) => {
    if (!numberWindow.has(num)) {
      if (numberWindow.size >= windowSize) {
        numberWindow.delete(prevState[0]);
        numberWindow.add(num);
      }
    }
  });

  const currState = Array.from(numberWindow);
  const average = getAverage(numberWindow);

  res.json({
    windowPrevState: prevState,
    windowCurrState: currState,
    numbers: newNumbers,
    average: average,
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
