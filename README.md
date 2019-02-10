# Heart Ping

[![License][license-image]][license-url]
[![Current Version](https://img.shields.io/npm/v/heart-ping.svg)](https://www.npmjs.com/package/heart-ping)
[![npm](https://img.shields.io/npm/dw/heart-ping.svg)](https://www.npmjs.com/package/heart-ping)
![](https://img.shields.io/bundlephobia/min/heart-ping.svg?style=flat)

[license-url]: https://opensource.org/licenses/MIT
[license-image]: https://img.shields.io/npm/l/make-coverage-badge.svg

A simple light-weight Typescript module for pinging HTTP services at set intervals to provide a heartbeat.

### Installation

```
npm install heart-ping --save
```

### Usage

```typescript
import HeartPing from 'heart-ping'

myHeartPing = new HeartPing();
myHeartPing.setBeatInterval(10000);
myHeartPing.setBeatTimeout(30000);
myHeartPing.setOnTimeout(() => {
	console.log('The ping request to www.google.com has timed out!');
});
myHeartPing.start(
    "www.google.com", // or using https, e.g.: 'https://www.google.com'
    80,
    (time) => {
        console.log(`Successfully pinged www.google.com! It took ${time} milliseconds.`);
    },
    () => {
        console.log('Failed to ping www.google.com!');
    }
);
```