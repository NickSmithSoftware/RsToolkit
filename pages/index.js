import { Line } from 'react-chartjs-2';
import React, { useState } from 'react';
import { CategoryScale, Chart, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Home() {
  const [items, setItems] = useState([{ label: '', probability: '' }]);
  const [endPoint, setEndPoint] = useState(100);

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

  const addItem = () => {
    setItems([...items, { label: '', probability: '' }])
  }

  const handleChangeItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  }

  const handleChangeEndpoint = (event) => {
    if (!event.target.value) {
      setEndPoint(1)
    }
    setEndPoint(event.target.value);
  }

  let probValues = items.map((item) => parseProbability(item.probability));

  let kills = Array.from({ length: parseInt(endPoint) }, (_, i) => i + 1);

  let chancesArrays = probValues.map((prob) => {
    return kills.map((kill) => calculatePercentileChance(prob, kill));
  });

  let chanceAnyArray = chancesArrays.reduce((a, b) => {
    return a.map((val, i) => 1 - (1 - val) * (1 - b[i]));
  }, new Array(parseInt(endPoint)).fill(0));

  const data = {
    labels: kills,
    datasets: [...items.map((item, index) => ({
      label: item.label,
      data: chancesArrays[index],
      fill: false,
      borderColor: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
    })), {
      label: 'Any',
      data: chanceAnyArray,
      fill: false,
      borderColor: '#000000',
    }],
  };

  return (
    <div className="App">
      <h1>Percentile Drop Chance Calculator</h1>
      {items.map((item, index) => (
        <div key={index}>
          <label>
            Enter item label: 
            <input type="text" onChange={(e) => handleChangeItem(index, 'label', e.target.value)}/>
          </label>
          <label>
            Enter drop probability: 
            <input type="text" onChange={(e) => handleChangeItem(index, 'probability', e.target.value)}/>
          </label>
        </div>
      ))}
      <button onClick={addItem}>Add more items</button> 
      <br />

      <label>
        Enter end point for number of kills:
        <input type="text" onChange={handleChangeEndpoint} defaultValue={'100'} />
      </label>

      <Line data={data} />

    </div>
  );
}

export default Home;