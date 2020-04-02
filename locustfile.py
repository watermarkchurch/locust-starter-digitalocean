
from locust import HttpLocust, TaskSet, task, constant_pacing
from locust.contrib.fasthttp import FastHttpLocust

class RepresentativeTaskSet(TaskSet):

  @task(34)
  def get__active_banner:
    self.client.get("/active_banner")


  @task(16)
  def get__live:
    self.client.get("/live")


  @task(15)
  def get__api_v1_playlists_piZu5vHA:
    self.client.get("/api/v1/playlists/piZu5vHA")


  @task(8)
  def get__packs_js_5_3a1c7fafb428f173e0d5_chunk_js:
    self.client.get("/packs/js/5-3a1c7fafb428f173e0d5.chunk.js")


  @task(8)
  def get__packs_js_4_e20e4e0b357fb8132df7_chunk_js:
    self.client.get("/packs/js/4-e20e4e0b357fb8132df7.chunk.js")


  @task(8)
  def get__:
    self.client.get("/")


  @task(7)
  def get__messages_latest:
    self.client.get("/messages/latest")


  @task(3)
  def get__dallas:
    self.client.get("/dallas")


  @task(2)
  def get__plano:
    self.client.get("/plano")


  @task(2)
  def get__blog_how_to_be_a_godly_man:
    self.client.get("/blog/how-to-be-a-godly-man")


  @task(2)
  def get__tv:
    self.client.get("/tv")


  @task(2)
  def get__api_v1_graphql:
    self.client.get("/api/v1/graphql")


  @task(1)
  def get__kidskit:
    self.client.get("/kidskit")


  @task(1)
  def get__blog_kidskit_march29:
    self.client.get("/blog/kidskit-march29")


  @task(1)
  def get__live_dallas:
    self.client.get("/live/dallas")


  @task(1)
  def get__blog_kidskit_March29:
    self.client.get("/blog/kidskit-March29")


  @task(1)
  def get__resources_the_current:
    self.client.get("/resources/the-current")


  @task(1)
  def get__the_current:
    self.client.get("/the-current")


  @task(1)
  def get__search_messages:
    self.client.get("/search/messages")


  @task(0)
  def get__current:
    self.client.get("/current")


class MyLocust(FastHttpLocust):
  task_set = RepresentativeTaskSet
  wait_time = constant_pacing(4)
