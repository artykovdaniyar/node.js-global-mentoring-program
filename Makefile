build:
	podman build -t node.js-gmp-app-img .

run:
	podman run -d -p 8000:8000 --rm --name node.js-gmp-app node.js-gmp-app-img

stop:
	podman stop node.js-gmp-app