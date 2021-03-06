import React, { useEffect, useState } from 'react';
import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined } from '@ant-design/icons';

export const provinceColours = {
  "Alberta": "gold",
  "British Columbia": "lightblue",
  "Grand Princess": "grey",
  "Manitoba": "purple",
  "New Brunswick": "orange",
  "Newfoundland and Labrador": "green",
  "Northwest Territories": "#ff3399",
  "Nova Scotia": "navy",
  "Ontario": "red",
  "Prince Edward Island": "brown",
  "Quebec": "blue",
  "Saskatchewan": "pink",
};

export function getArrow(change) {
  if (change > 0) {
    return <ArrowUpOutlined />;
  }
  if (change < 0) {
    return <ArrowDownOutlined />;
  }
  return <MinusOutlined />;
}

export async function getJSON(url) {
  const response = await fetch(url);
  return await response.json();
}

export function useJSON(url, setter) {
  useEffect(() => {
    getJSON(url).then(res => setter(res));
  }, [url]);
}

export function useJsonUpdates(url, setter, updateTime) {
  useEffect(() => {
    getJSON(url).then(res => setter(res));
    const interval = setInterval(() => {
      getJSON(url).then(res => setter(res));
    }, updateTime);

    return () => clearInterval(interval);
  }, [url, updateTime]);
}

export function percentChange(increase, last) {
  if (last === 0) {
    return 100 * increase;
  }
  return 100 * increase/last;
}

export function compareProvinces(a, b) {
  if (a.province < b.province){
    return -1;
  }
  if (a.province > b.province){
    return 1;
  }
  return 0;
}

export function useStateWithLocalStorage(key, defaultValue) {
  const storedVal = JSON.parse(localStorage.getItem(key));
  const initVal = storedVal !== null ? storedVal : defaultValue;

  const [value, setValue] = useState(initVal);

  useEffect(() => localStorage.setItem(key, value), [value]);

  return [value, setValue];
}
