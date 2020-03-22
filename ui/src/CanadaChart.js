import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { getArrow, provinceColours } from './helpers';

const canadaPopulation = 37647676; // March 19, 2020; https://www.worldometers.info/world-population/canada-population/

function canadaConfirmed(day) {
  const values = Object.entries(day).map(([key, value]) => {
    return key === "date" ? 0 : value;
  });
  return values.reduce((a, b) => a + b);
}

function CanadaChart(props) {
  const data = props.data;
  const dayCurrent = data[data.length-1];
  const dayLast = data[data.length-2];
  const confirmedCurrent = canadaConfirmed(dayCurrent);
  const confirmedLast = canadaConfirmed(dayLast);
  const confirmedIncrease = confirmedCurrent - confirmedLast;
  const confirmedArrow = getArrow(confirmedIncrease);
  const confirmedPercent = 100 * confirmedIncrease / confirmedLast;
  const confirmedPer100k = 100000 * confirmedCurrent / canadaPopulation;
  return (
    <Card title="Confirmed Canada-wide">
      <Row>
        <Col lg={20} span={24}>
          <div style={{marginRight: 15}}>
            <ResponsiveContainer height={450} width="100%">
              <AreaChart data={data}>
                {Object.keys(data[0]).map(key => {
                  const colour = provinceColours[key];
                  return key === "date" ? null : (
                    <Area
                      dataKey={key}
                      type="monotone"
                      stackId="canada"
                      stroke={colour}
                      fill={colour}
                      key={key}/>
                  );
                })}
                <XAxis
                  dataKey="date"
                  interval="preserveStartEnd"
                  minTickGap={300}
                />
                <YAxis />
                <Tooltip wrapperStyle={{zIndex: 1}}/>
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Col>
        <Col lg={4} span={24}>
          <Card>
            <Statistic
              title="Confirmed"
              value={confirmedCurrent}
            />
            <Statistic
              title="Confirmed/24h"
              prefix={confirmedArrow}
              value={confirmedIncrease}
            />
            <Statistic
              title="Percent/24h"
              value={confirmedPercent}
              precision={2}
              prefix={confirmedArrow}
              suffix="%"
            />
            <Statistic
              title="Confirmed Per 100k Population"
              value={confirmedPer100k}
              precision={2}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
}

export default CanadaChart;
