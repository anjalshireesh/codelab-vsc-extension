## Please Open this in the Markdown preview mode using the Preview button in the upper right.

### In this section we learned about:

- Basic Docker Commands
- Docker Images
- Docker Containers
- Docker Run Commands
  <br />
  <br />

---

---

## Lab 1 - Basic Docker Commands

Now let's practice running some of these commands. Click the burger menu in VSCode and go to . We will run all of the following commands in this terminal window. To run these commands, you can copy and paste them from the Markdown Preview window into the Terminal in VSCode.

<br />

---

To see what containers are running on your current system:

`docker ps` {{ execute }}

`k3d cluster create lab-cluster --volume /ab/k3dvol:/tmp/k3dvol --api-port 16443 --servers 1 --agents 3 -p 80:80@loadbalancer -p 443:443@loadbalancer -p "30000-30010:30000-30010@server[0]"` {{ execute }}

'k3d cluster create lab-cluster --volume /ab/k3dvol:/tmp/k3dvol --api-port 16443 --servers 1 --agents 3 -p 80:80@loadbalancer -p 443:443@loadbalancer -p "30000-30010:30000-30010@server[0]"' {{ execute }}

"k3d cluster create lab-cluster --volume /ab/k3dvol:/tmp/k3dvol --api-port 16443 --servers 1 --agents 3 -p 80:80@loadbalancer -p 443:443@loadbalancer -p "30000-30010:30000-30010@server[0]"" {{ execute }}
