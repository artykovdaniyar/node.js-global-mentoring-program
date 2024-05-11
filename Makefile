build:
	podman build -t node.js-gmp-app-img .

run:
	podman run -d -p 8000:8000 --rm --name node.js-gmp-app node.js-gmp-app-img

stop:
	podman stop node.js-gmp-app





run-build:
    podman build -t node-mentoring-program .

run-create:
    podman network create app_network

run-db:
	podman run --name mongodb -p 27017:27017 -d --network=app_network mongo

run-app:
	podman run --name node-mentoring-program -p 8000:8000 -d --network=app_network node-mentoring-program
