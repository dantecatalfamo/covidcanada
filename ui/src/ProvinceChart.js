import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { getArrow, percentChange } from './helpers';

function ProvinceChart(props) {
  const province = props.province;
  const data = props.data;
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
                  {/* <Line type="monotone" dot={false} dataKey="recovered" name="Recovered" stroke="green"/> */}
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
                    value={confirmedIncrease}
                    prefix={confirmedArrow}
                  />
                </Col>
              </Row>
              {/* <Row> */}
              {/*   <Col span={8}> */}
              {/*     <Statistic */}
              {/*       title="Recovered" */}
              {/*       value={recoveredCurrent} */}
              {/*     /> */}
              {/*   </Col> */}
              {/*   <Col span={16}> */}
              {/*     <Statistic */}
              {/*       title="Recovered/24h" */}
              {/*       value={recoveredIncrease} */}
              {/*       prefix={recoveredArrow} */}
              {/*     /> */}
              {/*   </Col> */}
              {/* </Row> */}
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
                    value={deathsIncrease}
                    prefix={deathsArrow}
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

export default ProvinceChart;
