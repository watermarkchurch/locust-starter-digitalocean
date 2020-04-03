#! /usr/bin/env node

const requestsFile = './requests.txt'
const locustFile = './locustfile.py'
const numberOfTasks = 20

const fs = require('fs')

if (!fs.existsSync(requestsFile)) {
  console.error('requests.txt does not exist!\n' +
    'Please download request logs in this format:\n' +
    '2020-03-29T13:00:00.668890+00:00 "54.162.189.219" "/dallas"')
  process.exit(1)
}

const lines = fs.readFileSync(requestsFile).toString().split('\n')

const byIp = {}
const byPath = {}

for (const line of lines) {
  let [ts, ip, path] = line.split(' ')
  
  if (!ts || ts.length == 0) {
    continue
  }

  const agg = byIp[ip] || {}
  agg.minTs = agg.minTs ? (agg.minTs < ts ? agg.minTs : ts) : ts
  agg.maxTs = agg.maxTs ? (agg.maxTs > ts ? agg.maxTs : ts) : ts
  byIp[ip] = agg

  path = path.replace(/\"/g, '')
  if (path.indexOf('?') != -1) {
    path = path.substring(0, path.indexOf('?'))
  }

  const pathAgg = byPath[path] || { path, count: 0 }
  byPath[path] = {
    ...pathAgg,
    count: pathAgg.count + 1,
  }
}

const activityDurations = []
for (const ip of Object.keys(byIp)) {
  const agg = byIp[ip]
  const min = Date.parse(agg.minTs)
  const max = Date.parse(agg.maxTs)

  activityDurations.push(max - min)
}

const uniqUsers = activityDurations.length
const medianTimeOnSite = median(activityDurations)
const requestsPerUser = lines.length / uniqUsers
const medianReqsPerSecond = requestsPerUser / (medianTimeOnSite / 1000)

console.log('uniq users         :', uniqUsers)
console.log('mean time on site  :', mean(activityDurations), 'ms')
console.log('median time on site:', medianTimeOnSite, 'ms')
console.log('median reqs/sec    :', medianReqsPerSecond)

let paths = []
for (const path of Object.keys(byPath)) {
  paths.push(byPath[path])
}

paths.sort((p1, p2) => p2.count - p1.count)
paths = paths.slice(0, numberOfTasks)

fs.writeFileSync(locustFile, `
from locust import HttpLocust, TaskSet, task, constant_pacing

class RepresentativeTaskSet(TaskSet):
${paths.map((p) => {
  return `
  @task(${p.count})
  def get_${p.path.replace(/\W/g, '_')}(self):
    self.client.get("${p.path}")
`
}).join('\n')}

class MyLocust(HttpLocust):
  task_set = RepresentativeTaskSet
  wait_time = constant_pacing(${Math.floor(1 / medianReqsPerSecond)})
`)




function sum(values) {
  return values.reduce((a, b) => a + b, 0)
}

function mean(values) {
  const s = sum(values)
  return s / values.length
}

function median(values){
  if(values.length === 0) return 0;

  values.sort(function(a,b){
    return a - b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2) {
    return values[half];
  }

  return (values[half - 1] + values[half]) / 2.0;
}
