import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';

export default function Home() {
  const [probabilities, setProbabilities] = useState('');
  const [endPoint, setEndPoint] = useState('');

  const parseProbability = (prob_str) => {
    if (prob_str.includes("/")) {
      const [numerator, denominator] = prob_str.split("/");
      return parseFloat(numerator) / parseFloat(denominator);
    } else {
      return parseFloat(prob_str);
    }
  }

  const calculatePercentileChance = (prob, kills) => {
    return 1 - Math.pow((1 - prob), kills);
  }

  const handleChangeProb = (event) => {
    setProbabilities(event.target.value);
  }

  const handleChangeEndpoint = (event) => {
    setEndPoint(event.target.value);
  }

  let probValues = probabilities.split(",");
  probValues = probValues.map((prob) => parseProbability(prob));

  let kills = Array.from({ length: parseInt(endPoint) }, (_, i) => i + 1);

  let chancesArrays = probValues.map((prob) => {
    return kills.map((kill) => calculatePercentileChance(prob, kill));
  });

  const data = {
    labels: kills,
    datasets: probValues.map((prob, index) => ({
      label: `P = ${prob}`,
      data: chancesArrays[index],
      fill: false,
      borderColor: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
    })),
  };

  return (
    <div className="App">
        <label>
          Enter drop probabilities (comma separated):
          <input type="text" onChange={handleChangeProb} />
        </label>
        <label>
          Enter end point for number of kills:
          <input type="text" onChange={handleChangeEndpoint} />
        </label>
        <Line data={data} />
    </div>
  )
}
