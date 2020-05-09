import React, { useState, useEffect } from 'react';
import './styles.css';
/** @jsx jsx */
import { jsx } from '@emotion/core';

function Slider({ value, min = 0, max = 100, step = 1 }) {
  const [selectedValue, setSelectedValue] = useState('');
  const [values, setValues] = useState([]);

  function getArrayOfValues({ max, min, step }) {
    const count = (max - min) / step;
    const arrayValues = Array(count + 1)
      .fill()
      .map((_, i) => min + i * step);
    return arrayValues;
  }

  useEffect(() => {
    console.log('effect');
    setSelectedValue(value || min);
    setValues(getArrayOfValues({ max, min, step }));
  }, [step, max, min]);

  return (
    <div className="slider">
      <div className="thumb"></div>
    </div>
  );
}

export default Slider;
