// const express = require("express");
// const axios = require("axios");

import express from 'express';
import axios from 'axios';

const app = express();
const port = 9876;

app.use(express.json());

// let windowPrevState = [];
// let windowCurrState = [];
let numberWindow = new Set();
let windowSize = 10;
const BASE_URL = "http://20.244.56.144/test";

const getNumbers = (async (id) => {
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

  const response = await axios.get(`${BASE_URL}/type`, { timeout: 500 });
  return response.data.numbers;
});

const getAverage = (numbers) => {
    if (numbers.length === 0) return 0;
    const sum = Array.from(numbers).reduce((s, num) => s + num, 0)
    return (sum / numbers.size).toFixed(2);
}


app.get('/numbers:id', async (req, res) => {
    const id = req.params.id;
    if (!['p','f','e','r'].includes(id)) {
        res.status(400).send({ error: 'Invalid ID' });
    }

    const prevState = Array.from(numberWindow);
    const newNumbers = await getNumbers(id);

    newNumbers.array.forEach(num => {
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
        average: average
    })
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})