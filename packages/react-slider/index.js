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
      {...props}
    />
  );
}

function Slider({ value, min = 0, max = 100, step = 1 }) {
  const [selectedValue, setSelectedValue] = useState('');
  const [values, setValues] = useState([]);

  const getArrayOfValues = ({ max, min, step }) => {
    const count = (max - min) / step;
    const arrayValues = Array(count + 1)
      .fill()
      .map((_, i) => min + i * step);
    return arrayValues;
  };

  const getPercentualValuePosition = (value, values) => {
    const valueArrayPosition = values.indexOf(value);
    if (valueArrayPosition === 0) return 0;
    return (valueArrayPosition / (values.length - 1)) * 100;
  };

  const handleSliderClick = event => {
    const targetRect = event.target.getClientRects()[0];
    const relativePosition = (event.pageX - targetRect.x) / targetRect.width;
    var position = Math.round((values.length - 1) * relativePosition);
    moveThumbPosition(position);
  };

  const moveThumbPosition = position => {
    const actualValue = values[position];
    setSelectedValue(actualValue);
  };

  const handleThumbMouseDown = event => {
    const targetRect = event.target.parentNode.getClientRects()[0];
    const onMouseMove = handleThumbMove(targetRect);
    const onMouseUp = event =>
      handleThumbMouseUp(onMouseMove, onMouseUp)(event);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleThumbMove = targetRect => event => {
    let relativePosition = (event.pageX - targetRect.x) / targetRect.width;
    if (relativePosition < 0 || relativePosition > 1) return;
    var position = Math.round((values.length - 1) * relativePosition);
    moveThumbPosition(position);
  };

  const handleThumbMouseUp = (onMouseMove, onMouseUp) => event => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  useEffect(() => {
    setSelectedValue(value || min);
    setValues(getArrayOfValues({ max, min, step }));
  }, [step, max, min]);

  return (
    <div className="slider" onClick={handleSliderClick}>
      <Thumb
        onMouseDown={handleThumbMouseDown}
        position={getPercentualValuePosition(selectedValue, values)}
      />
    </div>
  );
}

export default Slider;
