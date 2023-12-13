Archive note: this got moved into the Deployment repo https://github.com/watermarkchurch/deployment/tree/master/tools/locust

# DigitalOcean Locust Starter

This repository is a "Starter Kit" for running load tests on a Digital Ocean
cluster.  The kit installs [Locust](https://locust.io/) on your Digital Ocean
nodes and configures them to use the [locustfile.py](./locustfile.py) in the root
directory.

![Locust dashboard](https://locust.io/static/img/screenshot_0.12.1.png)

## Spinning up your Locust instances
is as easy as:
```
DIGITALOCEAN_API_TOKEN=${your api token} vagrant up --provider=digital_ocean
```

You'll need to create your API token at https://www.digitalocean.com/api_access

Follow [this tutorial from Digital Ocean](https://www.digitalocean.com/community/tutorials/how-to-use-digitalocean-as-your-provider-in-vagrant-on-an-ubuntu-12-10-vps)
if you run into any issues.

You'll also need to [install Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html).

By default it starts 1 master node and 4 slave nodes.  If you want more slave
nodes, you can set the `SLAVE_COUNT` environment variable before running your
vagrant commands.

```
$ export SLAVE_COUNT=8
$ vagrant up --provider=digital_ocean
```

Note: I've found that I can't start more than about 9 nodes or I get a rate limit
error from Digital Ocean.  This is an error in the Vagrant plugin.

## Turning off your instances

```
vagrant destroy
```
Remember that the `SLAVE_COUNT` environment variable should still be set - or else
you'll only turn off half your nodes!

## Running a test

Once everything is started up you should see a Locust dashboard appear in your
browser.  If nothing shows up, find this log line in your terminal:
```
locust running on http://xx.xx.xx.xx:8089
```
and copy-paste that link into your browser.

Now you can start your tests!

Remember to [read the Locust documentation!](https://docs.locust.io/en/stable/)

## Parsing your logs

I wrote a script that parses your log files and tries to create a snapshot of
representative user behavior.  It requires a text file of logs in the following
format:
```
2020-03-29T13:00:00.668890+00:00 "54.162.xxx.219" "/dallas"
2020-03-29T13:00:01.769000+00:00 "32.99.xxx.129" "/"
2020-03-29T13:00:02.420190+00:00 "54.162.xxx.219" "/live"
...
```
The above should be in a file called `requests.txt`

If you can figure out how to get your server logs in that format you can run
the script like this:
```
node parse_requests.js
```
That'll output a new `locustfile.py` for you to use in your tests which contains
your top 20 most requested paths, and the proportion in which each was requested.
