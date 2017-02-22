const xs = require('xstream').default
const schedule = require('node-schedule')

function ScheduleWrapper () {
  const jobs = {}

  this.scheduleJob = (cron, callback) => {
    schedule.scheduleJob(cron, callback)
  }

  this.scheduleNamedJob = (cron, name, callback) => {
    jobs[name] = schedule.scheduleJob(cron, callback)
  }

  this.cancel = name => {
    jobs[name].cancel()
  }
}

function makeScheduleDriver (config) {
  const scheduler = new ScheduleWrapper()

  function scheduleDriver (outgoing$) {
    outgoing$.addListener({
      next: name => {
        scheduler.cancel(name)
      },
      error: () => {
      },
      complete: () => {
      }
    })

    return {
      schedule: (cron, name) => xs.create({
        start: listener => {
          name === undefined
            ? scheduler.scheduleJob(cron, data => listener.next(data))
            : scheduler.scheduleNamedJob(cron, name, data => listener.next(data))
        },
        stop: () => {
        }
      })
    }
  }

  return scheduleDriver
}

module.exports = makeScheduleDriver
