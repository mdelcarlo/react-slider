import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import serializer from 'jest-emotion';
import Slider from '../index';

expect.addSnapshotSerializer(serializer);

test('snapshot - defaults', () => {
  const { container } = render(
    <Slider
      {...{
        min: -100,
        max: 100,
        step: 5,
      }}
    />
  );
  expect(container).toMatchSnapshot();
});

test('snapshot - disabled', () => {
  const { container } = render(
    <Slider
      {...{
        min: 0,
        max: 100,
        disabled: true,
      }}
    />
  );
  expect(container).toMatchSnapshot();
});

test('snapshot - labeled', () => {
  const { container } = render(
    <Slider
      {...{
        min: 0,
        max: 100,
        step: 10,
        value: 100,
        showLabel: true,
      }}
    />
  );
  expect(container).toMatchSnapshot();
});

test('snapshot - hasVisibleSteps', () => {
  const { container } = render(
    <Slider
      {...{
        min: 0,
        max: 100,
        step: 10,
        value: 100,
        hasVisibleSteps: true,
      }}
    />
  );
  expect(container).toMatchSnapshot();
});

test('click - hasVisibleSteps', () => {
  const clientRectsMock = jest.fn(() => [
    {
      x: 0,
      width: 160,
    },
  ]);
  global.window.Element.prototype.getClientRects = clientRectsMock;

  const { container, getByTestId } = render(
    <Slider
      {...{
        min: 0,
        max: 100,
        step: 10,
        value: 0,
        showLabel: true,
        hasVisibleSteps: true,
      }}
    />
  );
  const sliderLabel = getByTestId('slider__label');
  expect(sliderLabel.textContent).toEqual('0');
  const sliderStep = getByTestId('slider__step--100');
  fireEvent(
    sliderStep,
    Object.assign(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
      {
        pageX: 160,
      }
    )
  );
  expect(clientRectsMock).toHaveBeenCalled();
  expect(sliderLabel.textContent).toEqual('100');
  expect(container).toMatchSnapshot();
});

test('ArrowRight keyDown', () => {
  const { container, getByTestId } = render(
    <Slider
      {...{
        min: 0,
        max: 100,
        step: 10,
        value: 0,
        showLabel: true,
        hasVisibleSteps: true,
      }}
    />
  );

  const sliderThumb = getByTestId('slider__thumb');
  const sliderLabel = getByTestId('slider__label');
  expect(sliderLabel.textContent).toEqual('0');

  fireEvent.keyDown(sliderThumb, {
    key: 'ArrowRight',
    code: 'ArrowRight',
    keyCode: 39,
    charCode: 39,
  });

  expect(sliderLabel.textContent).toEqual('10');
  expect(container).toMatchSnapshot();
});

test('ArrowLeft keyDown', () => {
  const { container, getByTestId } = render(
    <Slider
      {...{
        min: 0,
        max: 100,
        step: 10,
        value: 10,
        showLabel: true,
        hasVisibleSteps: true,
      }}
    />
  );

  const sliderThumb = getByTestId('slider__thumb');
  const sliderLabel = getByTestId('slider__label');
  expect(sliderLabel.textContent).toEqual('10');

  fireEvent.keyDown(sliderThumb, {
    key: 'ArrowLeft',
    code: 'ArrowLeft',
    keyCode: 37,
    charCode: 37,
  });

  expect(sliderLabel.textContent).toEqual('0');
  expect(container).toMatchSnapshot();
});

test('ArrowLeft keyDown - left limit', () => {
  const { container, getByTestId } = render(
    <Slider
      {...{
        min: 0,
        max: 100,
        step: 10,
        value: 0,
        showLabel: true,
        hasVisibleSteps: true,
      }}
    />
  );

  const sliderThumb = getByTestId('slider__thumb');
  const sliderLabel = getByTestId('slider__label');
  expect(sliderLabel.textContent).toEqual('0');

  fireEvent.keyDown(sliderThumb, {
    key: 'ArrowLeft',
    code: 'ArrowLeft',
    keyCode: 37,
    charCode: 37,
  });

  expect(sliderLabel.textContent).toEqual('0');
});

test('ArrowRight keyDown - right limit', () => {
  const { container, getByTestId } = render(
    <Slider
      {...{
        min: 0,
        max: 100,
        step: 10,
        value: 100,
        showLabel: true,
        hasVisibleSteps: true,
      }}
    />
  );

  const sliderThumb = getByTestId('slider__thumb');
  const sliderLabel = getByTestId('slider__label');
  expect(sliderLabel.textContent).toEqual('100');

  fireEvent.keyDown(sliderThumb, {
    key: 'ArrowRight',
    code: 'ArrowRight',
    keyCode: 39,
    charCode: 39,
  });

  expect(sliderLabel.textContent).toEqual('100');
});
