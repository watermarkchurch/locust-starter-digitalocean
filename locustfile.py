
from locust import HttpLocust, TaskSet, task, constant_pacing

# This task set is designed to be representative of your users' behavior.  You
# should auto-generate this from your logs using the `parse_requests.js` script.
# Or you can hand-create a representative task set.
class RepresentativeTaskSet(TaskSet):

  @task(27990) # The number of requests to this URL over your sample period.  Defines the proportion.
  def get__active_banner(self): # A unique name for this Python method
    self.client.get("/active_banner") # GET the path on your web server

  @task(13588)
  def get__live(self):
    self.client.get("/live")

  # ... and repeat


class MyLocust(HttpLocust):
  task_set = RepresentativeTaskSet
  wait_time = constant_pacing(4) # This number defines how many requests your users make per second.
