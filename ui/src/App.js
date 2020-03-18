import React, { useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useJsonUpdates } from './helpers';
import './App.css';

const provincesURL = "/static/provinces.json";
const updateTime = 10000; //60 * 60 * 1000; // Once an hour

function App() {
  const [provinces, setProvinces] = useState({});
  useJsonUpdates(provincesURL, setProvinces, updateTime);
  console.log(provinces);
  const charts = Object.entries(provinces).map(([province, data]) => {
    console.log(province);
    const confirmedCurrent = data[data.length-1].confirmed || 0;
    const confirmedLast = data[data.length-2].confirmed || 0;
    const confirmedIncrease = confirmedCurrent - confirmedLast;
    let percent;
    if (confirmedLast == 0) {
      percent = confirmedIncrease * 100;
    } else {
      percent = 100 * confirmedIncrease/confirmedLast;
    }
    return (
      <div key={province}>
        <h2>{province}</h2>
        <LineChart data={data} height={400} width={400}>
          <Line type="monotone" dot={false} dataKey="confirmed"/>
          <Line type="monotone" dot={false} dataKey="recovered" stroke="green"/>
          <Line type="monotone" dot={false} dataKey="deaths" stroke="red"/>
          <CartesianGrid/>
          <Tooltip/>
          <Legend/>
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false}/>
        </LineChart>
        <div>
          <h3>24 Hours</h3>
          <p>
            {confirmedLast} → {confirmedCurrent}
          </p>
          <p>
            +{confirmedIncrease}
          </p>
          <p>
            +%{percent.toFixed(2)}
          </p>
          <data/>
        </div>
      </div>
    );
  });
  return (
    <div className="App">
      {charts}
    </div>
  );
}

export default App;
