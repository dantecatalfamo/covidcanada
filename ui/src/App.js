import React, { useState } from 'react';
import { Layout, Card, Row, Col, Statistic, Typography, Button } from 'antd';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import CanadaGraph from './CanadaGraph';
import { useJsonUpdates, getArrow, percentChange, compareProvinces } from './helpers';
import 'antd/dist/antd.css';
import './App.css';

const provincesURL = "/provinces.json";
const updateTime = 60 * 60 * 1000; // Once an hour

const { Header, Footer, Content } = Layout;

function provinceChart({province, data}) {
  const confirmedCurrent = data[data.length-1].confirmed;
  const confirmedLast = data[data.length-2].confirmed;
  const confirmedIncrease = confirmedCurrent - confirmedLast;
  const confirmedArrow = getArrow(confirmedIncrease);
  const confirmedPercent = percentChange(confirmedIncrease, confirmedLast);

  const recoveredCurrent = data[data.length-1].recovered;
  const recoveredLast = data[data.length-2].recovered;
  const recoveredIncrease = recoveredCurrent - recoveredLast;
  const recoveredArrow = getArrow(recoveredIncrease);
  const recoveredPercent = percentChange(recoveredIncrease, recoveredLast);

  const deathsCurrent = data[data.length-1].deaths;
  const deathsLast = data[data.length-2].deaths;
  const deathsIncrease = deathsCurrent - deathsLast;
  const deathsArrow = getArrow(deathsIncrease);
  const deathsPercent = percentChange(deathsIncrease, deathsLast);

  return (
    <Col
      span={24}
      key={province}>
      <Card title={province}>
        <Row>
          <Col lg={18} span={24}>
            <div style={{marginRight: 15}}>
              <ResponsiveContainer height={200} width="100%">
                <LineChart data={data}>
                  <Line type="monotone" dot={false} dataKey="confirmed" name="Confirmed" />
                  <Line type="monotone" dot={false} dataKey="recovered" name="Recovered" stroke="green"/>
                  <Line type="monotone" dot={false} dataKey="deaths" name="Deaths" stroke="red"/>
                  <Tooltip/>
                  <Legend/>
                  <XAxis
                    dataKey="date"
                    interval="preserveStartEnd"
                    minTickGap={300}
                  />
                  <YAxis allowDecimals={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Col>
          <Col lg={6} span={24}>
            <Card type="inner">
              <Row>
                <Col span={8}>
                  <Statistic
                    title="Confirmed"
                    value={confirmedCurrent}
                  />
                </Col>
                <Col span={16}>
                  <Statistic
                    title="Confirmed/24h"
                    value={confirmedPercent}
                    prefix={confirmedArrow}
                    precision={2}
                    suffix="%"
                  />
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Statistic
                    title="Recovered"
                    value={recoveredCurrent}
                  />
                </Col>
                <Col span={16}>
                  <Statistic
                    title="Recovered/24h"
                    value={recoveredPercent}
                    prefix={recoveredArrow}
                    precision={2}
                    suffix="%"
                  />
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Statistic
                    title="Deaths"
                    value={deathsCurrent}
                  />
                </Col>
                <Col span={16}>
                  <Statistic
                    title="Deaths/24h"
                    value={deathsPercent}
                    prefix={deathsArrow}
                    precision={2}
                    suffix="%"
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Card>
    </Col>
  );
}

function toCanada(provinces) {
  const canadaArray = [];
  provinces[0].data.forEach(day => {
    canadaArray.push({
      date: day.date
    });
  });
  provinces.forEach(province => {
    province.data.forEach((day, idx) => {
      canadaArray[idx][province.province] = day.confirmed;
    });
  });
  return canadaArray;
}

function App() {
  const [provinces, setProvinces] = useState({});

  useJsonUpdates(provincesURL, setProvinces, updateTime);
  const provinceArray = Object.entries(provinces).map(([province, data]) => ({province, data}));
  provinceArray.sort(compareProvinces);
  const provinceCharts = provinceArray.length ? provinceArray.map(provinceChart) : [];

  const canadaData = provinceArray.length ? toCanada(provinceArray) : {};
  const canadaChart = canadaData.length ? <CanadaGraph data={canadaData} /> : null;

  return (
    <div className="App">
      <Layout>
        <Header>
          <h2 style={{
            color: "rgba(255, 255, 255, 0.85)",
            fontWeight: 600,
            fontSize: "30px"
          }}>
            COVID-19 in Canada
          </h2>
        </Header>
        <Content>
          <Row>
            <Col span={20} offset={2}>
              <div style={{marginTop: 8, marginBottom: 8}}>
                <Row>
                  <Col>
                    {canadaChart}
                  </Col>
                </Row>
              </div>
              <Row gutter={[8, 8]}>
                {provinceCharts}
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={20} offset={2}>
              <Card title="Further Reading">
                <Button
                  href="https://www.canada.ca/en/public-health/services/diseases/2019-novel-coronavirus-infection.html"
                  type="link"
                >Government of Canada</Button>
                <Button
                  href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019"
                  type="link"
                >World Health Organization</Button>
                <Button
                  href="https://www.cbc.ca/news/coronavirus-guide-explainer-1.5497009"
                  type="link"
                >CBC</Button>
              </Card>
            </Col>
          </Row>
        </Content>
        <Footer>
          <a href="https://github.com/dantecatalfamo/covidcanada">Github</a><br/>
          Data from <a href="https://github.com/CSSEGISandData/COVID-19">Johns Hopkins University CSSE</a><br/>
          Provinces and territories not displayed are not present in the data source
        </Footer>
      </Layout>
    </div>
  );
}

export default App;
