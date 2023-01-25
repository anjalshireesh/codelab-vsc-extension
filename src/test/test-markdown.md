## UNIX

`Some text to be copied` {{ copy }}

`ls` {{ execute }}

`la` {{ execute "T2" }}

`top` {{ execute }}
`ls` {{ execute interrupt }}

`top` {{ execute "T2" }}
`ls` {{ execute interrupt "T2" }}

---

## WIN

`Some text to be copied` {{ copy }}

`dir` {{ execute }}

'dir' {{ execute "T3" }}

'docker stats' {{ execute }}
'dir' {{ execute interrupt }}

'docker stats' {{ execute "T4" }}
'dir' {{ execute interrupt "T4" }}

---

`k3d cluster create lab-cluster --volume /ab/k3dvol:/tmp/k3dvol --api-port 16443 --servers 1 --agents 3 -p 80:80@loadbalancer -p 443:443@loadbalancer -p "30000-30010:30000-30010@server[0]"` {{ execute }}

'k3d cluster create lab-cluster --volume /ab/k3dvol:/tmp/k3dvol --api-port 16443 --servers 1 --agents 3 -p 80:80@loadbalancer -p 443:443@loadbalancer -p '30000-30010:30000-30010@server[0]'' {{ execute }}

`k3d cluster create lab-cluster --volume /ab/k3dvol:/tmp/k3dvol --api-port 16443 --servers 1 --agents 3 -p 80:80@loadbalancer -p 443:443@loadbalancer -p "30000-30010:30000-30010@server[0]"` {{ execute interrupt "T2" }}

---

![Image should be here](image.jpg)
