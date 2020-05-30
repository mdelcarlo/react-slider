import React, { useState, useEffect } from 'react';
import { keyCode } from './types';
import './styles.css';
/** @jsx jsx */
import { jsx } from '@emotion/core';

function Label(props) {
  return (
    <div
      id="slider__label"
      data-testid="slider__label"
      className="slider__label"
      {...props}
    />
  );
}

function Thumb(props) {
  const grabbedStyle = props.isGrabbed ? { cursor: 'grabbing' } : {};
  return (
    <div
      className="slider__thumb"
      css={{
        left: `calc(${props.position}% - 8px)`,
        ...grabbedStyle,
        ...props.focusStyle,
      }}
      data-testid="slider__thumb"
      role="slider"
      tabindex={props.disabled ? -1 : 1}
      aria-valuemin={props.min}
      aria-valuenow={props.selectedValue}
      aria-valuemax={props.max}
      aria-valuenow={props.selectedValue}
      aria-valuetext={props.selectedValue}
      aria-readonly={props.disabled}
      aria-disabled={props.disabled}
      disabled={props.disabled}
      aria-orientation="horizontal"
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
  hasVisibleSteps = false,
}) {
  const [selectedValue, setSelectedValue] = useState('');
  const [values, setValues] = useState([]);
  const [stepsPosition, setStepsPosition] = useState([]);
  const [isGrabbed, setGrabbed] = useState(false);
  const [isFocused, setFocus] = useState(false);
  const sliderRef = React.useRef();
  const toggleFocus = () => setFocus(!isFocused);

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

  const handleSliderClick = slider => event => {
    const target = event.target;
    if (
      !(
        target.classList[0] === 'slider' ||
        target.classList[0] === 'slider__step'
      )
    )
      return;
    const targetRect = slider.current.getClientRects()[0];
    const relativePosition = (event.pageX - targetRect.x) / targetRect.width;
    var position = Math.round((values.length - 1) * relativePosition);
    moveThumbPosition(position);
  };

  const getThumbPosition = () => values.indexOf(selectedValue);

  const moveThumbPosition = position => {
    if (position < 0 || position > values.length - 1) return;
    const actualValue = values[position];
    if (typeof onChange === 'function') {
      const event = { target: { value: actualValue } };
      onChange(event);
    }
    setSelectedValue(actualValue);
  };

  const moveThumbPositionUp = () => moveThumbPosition(getThumbPosition() + 1);
  const moveThumbPositionDown = () => moveThumbPosition(getThumbPosition() - 1);

  const handleThumbMouseDown = slider => event => {
    const targetRect = slider.current.getClientRects()[0];
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
    moveThumbPosition(position);
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
      eventKeyCode === keyCode.ArrowLeft ||
      eventKeyCode === keyCode.ArrowDown
    ) {
      moveThumbPositionDown();
    } else if (
      eventKeyCode === keyCode.ArrowRight ||
      eventKeyCode === keyCode.ArrowUp
    ) {
      moveThumbPositionUp();
    }
  };

  const getStepsPosition = values =>
    values.map(value => getPercentualValuePosition(value, values));

  useEffect(() => {
    setSelectedValue(value || defaultValue || min);
    setValues(getArrayOfValues({ max, min, step }));
  }, [step, max, min]);

  useEffect(() => {
    setStepsPosition(getStepsPosition(values));
  }, [values]);

  const classNames = `slider${className ? ` ${className}` : ''}`;
  const focusStyle = isFocused ? { boxShadow: '0px 0px 5px #333;' } : {};
  const drawSteps =
    hasVisibleSteps &&
    stepsPosition.map(stepPosition => (
      <a
        key={stepPosition}
        className="slider__step"
        data-testid={`slider__step--${stepPosition}`}
        css={{
          left: `calc(${stepPosition}%)`,
        }}
        onClick={handleSliderClick(sliderRef)}
        onKeyDown={handleKeyDown}
      ></a>
    ));
  return (
    <div
      ref={sliderRef}
      className={classNames}
      onClick={handleSliderClick(sliderRef)}
      role="slider"
      aria-labelledby="slider__label"
      disabled={disabled}
      aria-readonly={disabled}
      aria-disabled={disabled}
      onFocus={toggleFocus}
      onBlur={toggleFocus}
      css={{
        ...focusStyle,
      }}
    >
      <Thumb
        min={min}
        max={max}
        disabled={disabled}
        isGrabbed={isGrabbed}
        selectedValue={selectedValue}
        showLabel={showLabel}
        onMouseDown={handleThumbMouseDown(sliderRef)}
        onKeyDown={handleKeyDown}
        focusStyle={focusStyle}
        position={getPercentualValuePosition(selectedValue, values)}
      />
      {drawSteps}
    </div>
  );
}
export default Slider;
