import React, { useState, useEffect } from 'react';
import './styles.css';
/** @jsx jsx */
import { jsx } from '@emotion/core';

function Thumb(props) {
  return (
    <div
      className="thumb"
      css={{
        left: `calc(${props.position}% - 8px)`,
      }}
    />
  );
}

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

  function getPercentualValuePosition(value, values) {
    const valueArrayPosition = values.indexOf(value);
    if (valueArrayPosition === 0) return 0;
    return (valueArrayPosition / (values.length - 1)) * 100;
  }

  function handleSliderClick(event) {
    const targetRect = event.target.getClientRects()[0];
    const relativePosition = (event.pageX - targetRect.x) / targetRect.width;
    var position = Math.round((values.length - 1) * relativePosition);
    moveThumbPosition(position);
  }

  function moveThumbPosition(position) {
    console.log(position);
    setSelectedValue(values[position]);
  }

  useEffect(() => {
    console.log('effect');
    setSelectedValue(value || min);
    setValues(getArrayOfValues({ max, min, step }));
  }, [step, max, min]);

  return (
    <div className="slider" onClick={handleSliderClick}>
      <Thumb position={getPercentualValuePosition(selectedValue, values)} />
    </div>
  );
}

export default Slider;
