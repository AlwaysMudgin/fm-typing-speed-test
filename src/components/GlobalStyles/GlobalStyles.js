import { createGlobalStyle } from 'styled-components';
import Sora from '../../assets/fonts/Sora/Sora-VariableFont_wght.ttf';

const GlobalStyles = createGlobalStyle`
/* 1. Use a more-intuitive box-sizing model */
*, *::before, *::after {
  box-sizing: border-box;
}

/* 2. Remove default margin */
*:not(dialog) {
  margin: 0;
}

/* 3. Enable keyword animations */
@media (prefers-reduced-motion: no-preference) {
  html {
    interpolate-size: allow-keywords;
  }
}

body {
  /* 4. Add accessible line-height */
  line-height: 1.5;
  /* 5. Improve text rendering */
  -webkit-font-smoothing: antialiased;
}

/* 6. Improve media defaults */
img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

/* 7. Inherit fonts for form controls */
input, button, textarea, select {
  font: inherit;
}

/* 8. Avoid text overflows */
p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

/* 9. Improve line wrapping */
p {
  text-wrap: pretty;
}
h1, h2, h3, h4, h5, h6 {
  text-wrap: balance;
}

/*
  10. Create a root stacking context
*/
#root, #__next {
  isolation: isolate;
}

@font-face {
  font-family: "Sora";
  src: url(${Sora});
}

:root {
  --neutral-900: hsl(0deg, 0%, 7%);
  --neutral-800: hsl(0deg, 0%, 15%);
  --neutral-500: hsl(240deg, 3%, 46%);
  --neutral-400: hsl(240deg, 1%, 59%);

  --blue-600: hsl(214deg, 100%, 55%);
  --blue-400: hsl(210deg, 100%, 65%);

  --red: hsl(354deg, 63%, 57%);
  --green: hsl(140deg, 63%, 57%);
  --yellow: hsl(49deg, 85%, 70%);

  font-family: "Sora", sans-serif;
}

`;

export default GlobalStyles;
