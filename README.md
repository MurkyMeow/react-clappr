# react-clappr

This is a work-in-progress set of react wrappers for Clappr.js

Key points:

- `src/hooks` contains hooks to initialize Clappr and subscribe to it's state

- `src/ui/MediaControl` is a very interesting component - it's basically all the Clappr's ui including seekbar and controls implemented in React. The native Clappr's ui is very poorly made and hardly customizable. The implementation provided here gives a lot of freedom for customization.
