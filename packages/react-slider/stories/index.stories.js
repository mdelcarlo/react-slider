import React from 'react';
import { linkTo } from '@storybook/addon-links';
import Slider from '../index';

export default {
  title: 'Slider',
  component: Slider,
};

export const DefaultSlider = () => (
  <Slider
    {...{
      min: -100,
      max: 100,
      step: 5,
    }}
  />
);

export const MidSlider = () => (
  <Slider
    {...{
      min: 0,
      max: 100,
      step: 5,
      value: 50,
    }}
  />
);

export const MaxSlider = () => (
  <Slider
    {...{
      min: 0,
      max: 100,
      step: 50,
      value: 100,
    }}
  />
);

export const DisbledSlider = () => (
  <Slider
    {...{
      min: 0,
      max: 100,
      step: 50,
      disabled: true,
    }}
  />
);
