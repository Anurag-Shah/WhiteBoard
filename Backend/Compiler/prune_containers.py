import docker
import time as t

def prune(time):
	while True:
		client = docker.from_env()
		client.containers.prune()
		t.sleep(time)

def main():
	prune(600)

if __name__ == "__main__":
	main()