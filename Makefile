
build-app:
    podman build -t node-mentoring-program .

create-network:
    podman network create app_network

run-db:
	podman run --name mongodb -p 27017:27017 -d --network=app_network mongo

run-app:
	podman run --name node-mentoring-program -p 8000:8000 -d --network=app_network node-mentoring-program
