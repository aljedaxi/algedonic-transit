import gtfs_realtime_pb2
import sys
from datetime import datetime

station = """6807,6807,"NB Victoria Park / Stampede CTrain Station",,  51.038395,-114.058209,,,0"""
stop_id = "6807"

feed = gtfs_realtime_pb2.FeedMessage()
with open(sys.argv[-1], "rb") as f:
    feed.ParseFromString(f.read())

def arrival_times(route_id, stop_id):
    for entity in feed.entity:
        if entity.trip_update.trip.route_id == "201":
            for update in entity.trip_update.stop_time_update:
                if update.stop_id == stop_id:
                    yield datetime.fromtimestamp(update.arrival.time)



now = datetime.now()
for time in arrival_times("201", stop_id):
    print(time)
    print(time - now)
