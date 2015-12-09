.PHONY: build

install:
	@npm install

clean:
	@rm -rf dist

build: copy-ng-admin
	@./node_modules/.bin/webpack -p --progress --colors --devtool source-map

copy-ng-admin:
	@mkdir -p dist
	@cp ./node_modules/ng-admin/build/ng-admin.min.js dist/
	@cp ./node_modules/ng-admin/build/ng-admin.min.js.map dist/

run: copy-ng-admin
	@echo "**************************************************"
	@echo "* open http://localhost:8080/webpack-dev-server/ *"
	@echo "**************************************************"
	@./node_modules/.bin/webpack-dev-server --progress --debug --colors --hot --inline
