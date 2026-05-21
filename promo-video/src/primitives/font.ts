import {loadFont} from '@remotion/google-fonts/Inter';

const {fontFamily: family} = loadFont('normal', {
  weights: ['400', '600', '700'],
});

export const fontFamily = family;
