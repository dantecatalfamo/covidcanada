import React, { useState } from 'react';
import { Layout, Card, Row, Col, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useJsonUpdates } from './helpers';
import 'antd/dist/antd.css';
import './App.css';

const provincesURL = "/static/provinces.json";
const updateTime = 10000; //60 * 60 * 1000; // Once an hour

const { Header, Footer, Content } = Layout;

function percentChange(increase, last) {
  if (last == 0) {
    return 100 * increase;
  }
  return 100 * increase/last;
}

function compareProvinces(a, b) {
  if (a.province < b.province){
    return -1;
  }
  if (a.province > b.province){
    return 1;
  }
  return 0;
}

function provinceChart({province, data}) {
  const confirmedCurrent = data[data.length-1].confirmed || 0;
  const confirmedLast = data[data.length-2].confirmed || 0;
  const confirmedIncrease = confirmedCurrent - confirmedLast;
  const confirmedIncreasing = !(confirmedIncrease < 0);
  const confirmedArrow = confirmedIncreasing ? <ArrowUpOutlined/> : <ArrowDownOutlined/>;
  const confirmedPercent = percentChange(confirmedIncrease, confirmedLast);

  const recoveredCurrent = data[data.length-1].recovered || 0;
  const recoveredLast = data[data.length-2].recovered || 0;
  const recoveredIncrease = recoveredCurrent - recoveredLast;
  const recoveredPercent = percentChange(recoveredIncrease, recoveredLast);

  const deathsCurrent = data[data.length-1].deaths || 0;
  return (
    <Col span={24} xl={12}>
      <Card title={province}>
        <Card.Grid hoverable={false} style={{width: "75%"}}>
          <ResponsiveContainer height={200} width="100%">
            <LineChart data={data}>
              <Line type="monotone" dot={false} dataKey="confirmed" name="Confirmed" />
              <Line type="monotone" dot={false} dataKey="recovered" name="Recovered" stroke="green"/>
              <Line type="monotone" dot={false} dataKey="deaths" name="Deaths" stroke="red"/>
              <CartesianGrid/>
              <Tooltip/>
              <Legend/>
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card.Grid>
        <Card.Grid hoverable={false} style={{width: "25%", height: "248px"}}>
          <Statistic
            title="Confirmed"
            value={confirmedCurrent}
          />
          <Statistic
            title="Recovered"
            value={recoveredCurrent}
          />
          <Statistic
            title="Deaths"
            value={deathsCurrent}
          />
          <data/>
        </Card.Grid>
      </Card>
    </Col>
  );
}

function App() {
  const [provinces, setProvinces] = useState({});

  useJsonUpdates(provincesURL, setProvinces, updateTime);
  const provinceArray = Object.entries(provinces).map(([province, data]) => ({province, data}));
  provinceArray.sort(compareProvinces);
  const provinceCharts = provinceArray.map(provinceChart);
  return (
    <div className="App">
      <Layout>
        <Header>Header</Header>
        <Content>
          <Row>
            <Col span={20} offset={2}>
              <Row gutter={[8, 8]}>
                {provinceCharts}
              </Row>
            </Col>
          </Row>
        </Content>
        <Footer>Data from <a href="https://github.com/CSSEGISandData/COVID-19">CSSE at Johns Hopkins University</a></Footer>
      </Layout>
    </div>
  );
}

export default App;
