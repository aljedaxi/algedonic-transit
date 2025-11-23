import g from 'gtfs-realtime-bindings'
import {Temporal, Intl, toTemporalInstant} from '@js-temporal/polyfill'

const {transit_realtime: realtime} = g
Date.prototype.toTemporalInstant = toTemporalInstant;

const station = `6807,6807,"NB Victoria Park / Stampede CTrain Station",,  51.038395,-114.058209,,,0`
const stopId = "6807"
const howLongItTakesToGetToTheStop = {seconds: 5 * 60}

function* arrivalTimes(feed, routeId, stopId) {
  for (const entity of feed.entity) {
    const {tripUpdate = {}} = entity
    const {trip, stopTimeUpdate} = tripUpdate
    if (trip.routeId !== routeId) {
      continue
    }
    for (const update of stopTimeUpdate) {
      if (update.stopId === stopId) {
        yield update
      }
    }
  }
}

const res = await fetch("https://data.calgary.ca/api/views/gs4m-mdc2/files/25ea293a-507b-48e2-93e8-84e4753d3898?filename=tripupdates.pb")
if (!res.ok) {throw new Error('fuck lol')}
const buffer = await res.arrayBuffer()
const feed = realtime.FeedMessage.decode(new Uint8Array(buffer))
// console.log(JSON.stringify(feed, null, 2))
for (const update of arrivalTimes(feed, '201', stopId)) {
  const {departure: {time: {low}}} = update
  const departure = new Date(low * 1e3).toTemporalInstant()
  const now = Temporal.Now.instant()
  const timeUntilDeparture = departure.until(now)
  const leaveTime = timeUntilDeparture.subtract(Temporal.Duration.from(howLongItTakesToGetToTheStop))

  const minutesUntilNextTrain = leaveTime.seconds / 60
  console.log(`Assuming it takes you ${howLongItTakesToGetToTheStop.seconds / 60}m to get there, leave in ${minutesUntilNextTrain.toFixed()}m`)
}
