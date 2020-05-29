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
      width: 100,
      x: 30,
    },
  ]);
  const rafMock = jest.fn();
  global.window.Element.prototype.getClientRects = clientRectsMock;
  global.window.requestAnimationFrame = rafMock;

  const { container, getByTestId } = render(
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

  const sliderStep = getByTestId('slider__step--100');
  fireEvent(
    sliderStep,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );
  expect(clientRectsMock).toHaveBeenCalled();
  expect(container).toMatchSnapshot();
});
