import React, { useState } from 'react';
import { Layout, Card, Row, Col, Statistic, Typography, Button, Divider, Spin, Alert } from 'antd';
import CanadaChart from './CanadaChart';
import ProvinceChart from './ProvinceChart';
import { useJsonUpdates, getArrow, percentChange, compareProvinces, useStateWithLocalStorage } from './helpers';
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
  const [showSourceBanner, setShowSourceBanner] = useStateWithLocalStorage('showSourceBanner', true);

  const toggleSourceBanner = () => setShowSourceBanner(v => !v);

  useJsonUpdates(provincesURL, setProvinces, updateTime);

  const provinceArray = Object.entries(provinces).map(([province, data]) => ({province, data}));
  provinceArray.sort(compareProvinces);

  const provinceCharts = provinceArray.length ? provinceArray.map(
    ({province, data}) => <ProvinceChart province={province} data={data} />
  ) : [];

  const canadaData = provinceArray.length ? toCanada(provinceArray) : {};
  const canadaChart = canadaData.length ? <CanadaChart data={canadaData} /> : null;
  const loadingCard = canadaChart ? null : <LoadingCard />;
  const accuracyBanner = (
    <Alert
      type="error"
      message={<span>Yesterday's results <a href="https://www.ontario.ca/page/2019-novel-coronavirus">do not appear to be accurate</a>. Johns Hopkins may not have compiled them correctly, or may have accidentally published incorrect numbers.</span>}
    />
  );
  const sourceBanner = showSourceBanner ? (
    <Alert
      type="info"
      message={<span>Data from <a href="https://github.com/CSSEGISandData/COVID-19">Johns Hopkins University CSSE</a>, updated daily</span>}
      afterClose={toggleSourceBanner}
      closable
    />
  ) : null;

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
                <Row gutter={[8, 8]}>
                  <Col span={24}>
                    {accuracyBanner}
                    {sourceBanner}
                  </Col>
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
              <Card title="More Information">
                <div className="App-readingbuttons">
                  <Button
                    href="https://www.canada.ca/en/public-health/services/diseases/2019-novel-coronavirus-infection.html"
                    danger
                  >Government of Canada</Button>
                </div>
                <div className="App-readingbuttons">
                  <Button
                    href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019"
                    danger
                  >World Health Organization</Button>
                </div>
                <div className="App-readingbuttons">
                  <Button
                    href="https://www.cbc.ca/news/coronavirus-guide-explainer-1.5497009"
                    danger
                  >CBC</Button>
                </div>
                <div className="App-readingbuttons">
                  <Button
                    href="https://www.coronasafe.in/"
                    danger
                  >Corona Safe</Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Content>
        <Footer>
          Project by Dante Catalfamo, source on <a href="https://github.com/dantecatalfamo/covidcanada">Github</a><br/>
          Data from <a href="https://github.com/CSSEGISandData/COVID-19">Johns Hopkins University CSSE</a>, updated daily<br/>
          Provinces and territories not displayed are not present in the data source
        </Footer>
      </Layout>
    </div>
  );
}

export default App;
