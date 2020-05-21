import React, { useState, useEffect } from 'react';
import { keyCode } from './types';
import './styles.css';
/** @jsx jsx */
import { jsx } from '@emotion/core';

function Label(props) {
  return <div id="slider__label" className="slider__label" {...props} />;
}

function Thumb(props) {
  const grabbedStyle = props.isGrabbed ? { cursor: 'grabbing' } : {};
  return (
    <div
      className="slider__thumb"
      css={{
        left: `calc(${props.position}% - 8px)`,
        ...grabbedStyle,
      }}
      {...props}
    >
      {props.showLabel && <Label>{props.selectedValue}</Label>}
    </div>
  );
}

function Slider({
  className,
  disabled,
  onChange,
  onChangeCommitted,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  showLabel = false,
}) {
  const [selectedValue, setSelectedValue] = useState('');
  const [values, setValues] = useState([]);
  const [isGrabbed, setGrabbed] = useState(false);
  const requestRef = React.useRef();
  const sliderRef = React.useRef();

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
    const target = event.target;
    if (target.classList[0] !== 'slider') return;
    const targetRect = target.getClientRects()[0];
    const relativePosition = (event.pageX - targetRect.x) / targetRect.width;
    var position = Math.round((values.length - 1) * relativePosition);
    requestRef.current = requestAnimationFrame(() =>
      moveThumbPosition(position)
    );
  };

  const getThumbPosition = () => values.indexOf(selectedValue);

  const moveThumbPosition = position => {
    const actualValue = values[position];
    if (typeof onChange === 'function') {
      const event = { target: { value: actualValue } };
      onChange(event);
    }
    setSelectedValue(actualValue);
  };

  const moveThumbPositionUp = () =>
    (requestRef.current = requestAnimationFrame(() =>
      moveThumbPosition(getThumbPosition + 1)
    ));
  const moveThumbPositionDown = () =>
    (requestRef.current = requestAnimationFrame(() =>
      moveThumbPosition(getThumbPosition - 1)
    ));

  const handleThumbMouseDown = event => {
    console.log('parent', event.target.parentNode, sliderRef);
    const targetRect = sliderRef.current.getClientRects()[0];
    setGrabbed(true);
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
    requestRef.current = requestAnimationFrame(() =>
      moveThumbPosition(position)
    );
  };

  const handleThumbMouseUp = (onMouseMove, onMouseUp) => () => {
    if (typeof onChangeCommitted === 'function') {
      const event = { target: { value: selectedValue } };
      onChangeCommitted(event);
    }
    setGrabbed(false);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  const handleKeyDown = event => {
    const eventKeyCode = event.keyCode;
    if (
      eventKeyCode === keyCode.arrowLeft ||
      eventKeyCode === keyCode.arrowDown
    ) {
      moveThumbPositionDown();
    } else if (
      eventKeyCode === keyCode.arrowRight ||
      eventKeyCode === keyCode.arrowUp
    ) {
      moveThumbPositionUp();
    }
  };

  useEffect(() => {
    setSelectedValue(value || defaultValue || min);
    setValues(getArrayOfValues({ max, min, step }));
    return () => cancelAnimationFrame(requestRef.current);
  }, [step, max, min]);
  const classNames = `slider${className ? ` ${className}` : ''}`;
  return (
    <div
      ref={sliderRef}
      className={classNames}
      onClick={handleSliderClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      role="slider"
      aria-labelledby="slider__label"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={selectedValue}
      aria-valuetext={selectedValue}
    >
      <Thumb
        isGrabbed={isGrabbed}
        selectedValue={selectedValue}
        showLabel={showLabel}
        onMouseDown={handleThumbMouseDown}
        position={getPercentualValuePosition(selectedValue, values)}
      />
    </div>
  );
}

export default Slider;
