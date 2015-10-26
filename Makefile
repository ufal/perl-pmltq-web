.PHONY: build

install:
	@npm install

build:
	@./node_modules/.bin/webpack -p --progress --colors --devtool source-map --json

run:
	@echo "**************************************************"
	@echo "* open http://localhost:8080/webpack-dev-server/ *"
	@echo "**************************************************"
	@./node_modules/.bin/webpack-dev-server --progress --colors --hot --inline
