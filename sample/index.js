const xs = require('xstream').default
const makeScheduleDriver = require('../src/makeScheduleDriver')
const Cycle = require('@cycle/xstream-run')

function makeDebugDriver (config) {
  function debugDriver (outgoing$) {
    outgoing$.addListener({
      next: log => {
        console.log(log)
      },
      error: () => {
      },
      complete: () => {
      }
    })

    return {
      select: name => xs.create({
        start: listener => {
        },
        stop: () => {
        }
      })
    }
  }

  return debugDriver
}

const main = sources => {
  // Cron job that occurs at every 10th second in a minute, using an object
  const tenthSecond$ = sources.schedule.schedule({ second: 10 })
  // Cron job that occurs at every 59th second in a minute, using a string and with assigning a name
  const lastSecond$ = sources.schedule.schedule('59 * * * * *', 'last')

  // Schedule a cron job to run in one minute from now
  const now = new Date()
  const oneMinute = now.setTime(now.getTime() + 1000 * 60)
  const oneMinute$ = sources.schedule.schedule(oneMinute)

  // After one minute, cancel lastSecond$ job
  const cancelLast$ = oneMinute$.mapTo('last')

  // Create logging data from schedule streams
  const tenthLog$ = tenthSecond$
    .mapTo(1)
    .fold((a, b) => a + b, 0)
    .filter(count => count > 0)
    .map(count => `We have encountered second number 10 ${count} times`)

  const lastLog$ = lastSecond$
    .map(() => `Final second is at ${new Date().toLocaleString()}`)

  const startLog$ = xs.of(now)
    .map(time => `Application started at ${time.toLocaleString()}`)

  const minuteLog$ = oneMinute$
    .map(() => `One minute has passed since application started`)

  const debug$ = xs.merge(tenthLog$, lastLog$, startLog$, minuteLog$)

  return {
    schedule: cancelLast$,
    debug: debug$
  }
}

const drivers = {
  schedule: makeScheduleDriver(),
  debug: makeDebugDriver()
}

Cycle.run(main, drivers)
