import React, { useState } from 'react';
import { Layout, Card, Row, Col, Statistic, Typography, Button, Divider, Spin } from 'antd';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import CanadaChart from './CanadaChart';
import ProvinceChart from './ProvinceChart';
import { useJsonUpdates, getArrow, percentChange, compareProvinces } from './helpers';
import 'antd/dist/antd.css';
import './App.css';

const provincesURL = "/provinces.json";
const updateTime = 60 * 60 * 1000; // Once an hour

const { Header, Footer, Content } = Layout;

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

function LoadingCard(props) {
  return (
    <Spin>
      <Card>
        <div style={{height: 300}}/>
      </Card>
    </Spin>
  );
}

function App() {
  const [provinces, setProvinces] = useState({});

  useJsonUpdates(provincesURL, setProvinces, updateTime);
  const provinceArray = Object.entries(provinces).map(([province, data]) => ({province, data}));
  provinceArray.sort(compareProvinces);
  const provinceCharts = provinceArray.length ? provinceArray.map(
    ({province, data}) => <ProvinceChart province={province} data={data} />
  ) : [];

  const canadaData = provinceArray.length ? toCanada(provinceArray) : {};
  const canadaChart = canadaData.length ? <CanadaChart data={canadaData} /> : null;

  const loadingCard = canadaChart ? null : <LoadingCard />;

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
                    {loadingCard}
                    {canadaChart}
                  </Col>
                </Row>
              </div>
              <Divider>Provincial Breakdown</Divider>
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
