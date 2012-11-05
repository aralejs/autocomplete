build:
	liquidluck build -v -s $(HOME)/.liquidluck-themes/arale2/settings.yml

server:
	liquidluck server -d -s $(HOME)/.liquidluck-themes/arale2/settings.yml

test:
	@./node_modules/.bin/phantomjs run_jasmine_test.coffee http://localhost:8000/tests/runner.html
