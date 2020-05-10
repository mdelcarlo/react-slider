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
