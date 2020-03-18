import React, { useState } from 'react';
import { Layout, Card, Row, Col, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useJsonUpdates } from './helpers';
import './App.css';
import 'antd/dist/antd.css';

const provincesURL = "/static/provinces.json";
const updateTime = 10000; //60 * 60 * 1000; // Once an hour

const { Header, Footer, Content } = Layout;

function App() {
  const [provinces, setProvinces] = useState({});
  useJsonUpdates(provincesURL, setProvinces, updateTime);
  console.log(provinces);
  const charts = Object.entries(provinces).map(([province, data]) => {
    const confirmedCurrent = data[data.length-1].confirmed || 0;
    const confirmedLast = data[data.length-2].confirmed || 0;
    const confirmedIncrease = confirmedCurrent - confirmedLast;
    const confirmedIncreasing = !(confirmedIncrease < 0);
    let confirmedPercent;
    if (confirmedLast == 0) {
      confirmedPercent = confirmedIncrease * 100;
    } else {
      confirmedPercent = 100 * confirmedIncrease/confirmedLast;
    }
    const arrow = confirmedIncreasing ? <ArrowUpOutlined/> : <ArrowDownOutlined/>;
    return (
      <Col span={12}>
        <Card title={province}>
          <Card.Grid hoverable={false} style={{width: "70%"}}>
            <ResponsiveContainer height={200} width="100%">
              <LineChart data={data}>
                <Line type="monotone" dot={false} dataKey="confirmed" name="Confirmed" />
                <Line type="monotone" dot={false} dataKey="recovered" name="Recovered" stroke="green"/>
                <Line type="monotone" dot={false} dataKey="deaths" name="Deaths" stroke="red"/>
                <CartesianGrid/>
                <Tooltip/>
                <Legend/>
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false}/>
              </LineChart>
            </ResponsiveContainer>
          </Card.Grid>
          <Card.Grid hoverable={false} style={{width: "30%", height: "248px"}}>
            <Statistic
              title="New Cases"
              value={confirmedIncrease}
            />
            <Statistic
              // title="Percent change"
              value={confirmedPercent}
              precision={2}
              prefix={arrow}
              suffix="%"
            />
            <data/>
          </Card.Grid>
        </Card>
      </Col>
    );
  });
  return (
    <div className="App">
      <Layout>
        <Header>Header</Header>
        <Content>
          <Row gutter={[8, 8]}>
            {charts}
          </Row>
        </Content>
        <Footer>Data from <a href="https://github.com/CSSEGISandData/COVID-19">CSSE at Johns Hopkins University</a></Footer>
      </Layout>
    </div>
  );
}

export default App;
