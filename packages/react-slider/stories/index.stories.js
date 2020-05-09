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
