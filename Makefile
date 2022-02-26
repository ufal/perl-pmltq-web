.PHONY: build

install:
	@npm i --force
	@cp app/theme.config node_modules/semantic-ui-less/

clean:
	@rm -rf dist

build: copy-ng-admin
	@echo "'$$THEME' theme is set (THEME='$$THEME' make build)"
	@echo "available themes: '', LINDAT', 'LDC'"	
	@./node_modules/.bin/webpack -p --progress --devtool source-map
	@echo "'$$THEME' theme has been built"

copy-ng-admin:
	@mkdir -p dist
	@cp ./node_modules/ng-admin/build/ng-admin.min.js dist/
	@cp ./node_modules/ng-admin/build/ng-admin.min.js.map dist/

run: copy-ng-admin
	@echo "**************************************************"
	@echo "* open http://localhost:8080/webpack-dev-server/ *"
	@echo "**************************************************"
	./node_modules/.bin/webpack-dev-server --progress --hot --mode=development

runlindat: copy-ng-admin
	@echo "**************************************************"
	@echo "* open http://localhost:8080/webpack-dev-server/ *"
	@echo "**************************************************"
	@export THEME='LINDAT'; \
	./node_modules/.bin/webpack-dev-server --progress --hot

runldc: copy-ng-admin
	@echo "**************************************************"
	@echo "* open http://localhost:8080/webpack-dev-server/ *"
	@echo "**************************************************"
	@export THEME='LDC'; \
	./node_modules/.bin/webpack-dev-server --progress --hot
