# heart-ping

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