.PHONY: build

install:
	@npm install

clean:
	@rm -rf dist

build: copy-ng-admin
	@echo "'$$THEME' theme is set (THEME='$$THEME' make build)"
	@echo "available themes: '', LINDAT', 'LDC'"	
	@./node_modules/.bin/webpack -p --progress --colors --devtool source-map
	@echo "'$$THEME' theme has been built"

copy-ng-admin:
	@mkdir -p dist
	@cp ./node_modules/ng-admin/build/ng-admin.min.js dist/
	@cp ./node_modules/ng-admin/build/ng-admin.min.js.map dist/

run: copy-ng-admin
	@echo "**************************************************"
	@echo "* open http://localhost:8080/webpack-dev-server/ *"
	@echo "**************************************************"
	@./node_modules/.bin/webpack-dev-server --progress --debug --colors --hot --inline

runlindat: copy-ng-admin
	@echo "**************************************************"
	@echo "* open http://localhost:8080/webpack-dev-server/ *"
	@echo "**************************************************"
	@export THEME='LINDAT'; \
	./node_modules/.bin/webpack-dev-server --progress --debug --colors --hot --inline

runldc: copy-ng-admin
	@echo "**************************************************"
	@echo "* open http://localhost:8080/webpack-dev-server/ *"
	@echo "**************************************************"
	@export THEME='LDC'; \
	./node_modules/.bin/webpack-dev-server --progress --debug --colors --hot --inline
