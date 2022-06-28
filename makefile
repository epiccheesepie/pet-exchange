install:
	pnpm install --frozen-lockfile

uninstall:
	rm -rf node_modules

start:
	pnpx react-app-rewired start

build:
	pnpx react-app-rewired build

eslint:
	pnpx eslint --ext ts,tsx ./src

eslint-fix:
	pnpx eslint --ext ts,tsx --fix ./src

prettier:
	pnpx prettier --check "./src/**/*"

prettier-fix:
	pnpx prettier --write --loglevel=warn "./src/**/*"

stylelint:
	pnpx stylelint "./src/**/*.scss"

stylelint-fix:
	pnpx stylelint --fix "./src/**/*.scss"

.PHONY: $(MAKECMDGOALS)
