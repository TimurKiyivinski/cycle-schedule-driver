# cycle-schedule-driver
Cron-like schedule driver for Cycle.js

## installation
Install with NPM
```bash
npm install --save cycle-schedule-driver
```

## usage
Import the driver:
```javascript
const makeScheduleDriver = require('cycle-schedule-driver')
```
Register the driver:
```javascript
const drivers = {
  ...
  schedule: makeScheduleDriver()
}
```

### scheduling jobs
The general convention for scheduling jobs is as so:
```javascript
sources.schedule.select(cron)
```
Or optionally with a name:
```javascript
sources.schedule.select(cron, name)
```
Since this driver is based on [node-schedule](https://github.com/node-schedule/node-schedule),
it supports all the requests formats the library supports.

### cron-style
You can pass a cron string:
```javascript
sources.schedule.schedule('59 * * * * *', 'optional_name')
```
Where the convention is as so:
```
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    |
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
```

### JSON object
The most human friendly option is to just pass in a JSON object:
```javascript
sources.schedule.schedule({ second: 10 })
```

### date object
Finally, you can also just schedule it to run at a specific date:
```javascript
sources.schedule.schedule(dateObject)
```

### cancelling jobs
Named jobs can be cancelled by sending the name into the sink:
```javascript
{
  ...
  schedule: xs.of('dummy') // Kills the dummy job
}
```

## sample
A very basic sample that covers all use cases is available in the `sample/` folder.
```
Application started at 2/22/2017, 2:52:54 PM
Final second is at 2/22/2017, 2:51:59 PM
We have encountered second number 10 1 times
One minute has passed since application started
We have encountered second number 10 2 times
We have encountered second number 10 3 times
We have encountered second number 10 4 times
We have encountered second number 10 5 times
```
