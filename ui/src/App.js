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
    return (
      <LineChart data={data} height={400} width={400} key={province}>
        <Line type="monotone" dataKey="confirmed"/>
        <Line type="monotone" dataKey="recovered" stroke="green"/>
        <Line type="monotone" dataKey="deaths" stroke="red"/>
        <CartesianGrid/>
        <Tooltip/>
        <Legend/>
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false}/>
      </LineChart>
    );
  });
  return (
    <div className="App">
      {charts}
    </div>
  );
}

export default App;
