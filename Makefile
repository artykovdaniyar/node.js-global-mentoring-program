build:
	docker build -t node.js-gmp-app-img .
run: 
		docker run -d -p 8000:8000 --rm --name node.js-gmp-app node.js-gmp-app-img
stop: 
		docker stop node.js-gmp-app