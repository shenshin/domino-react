# Dominoes game in React

I wrote this small implementation of Domino to practice react and related technologies in order to animate components mount. The most challenging was to choose animation technology. My choise was beween CSS keyframes and two react animation libraries framer-motion and react-spring. Finally I chose the [Framer-Motion](https://www.framer.com/api/motion/) because I found it's logic more reasonable. As a state container I considered 'react context', but in the end I chose [Redux Toolkit](https://redux-toolkit.js.org/) because it makes it very convenient to keep all state-handling actions in logically separated slices rather than in some higher-order component. Finally I was thinking what styling engine to choose. I looked at css modules, sass, but selected [Styled Components](https://styled-components.com/) because it has a feature to pass JS variables (props) into CSS which I found extremely handy.
As a result, I managed to achieve my goal: I was able to animate mounting and unmounting of react components which is beautiful in itself.