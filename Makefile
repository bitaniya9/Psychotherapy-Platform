.PHONY: init dev build test migrate generate lint format ci

init:
	npm install
	npx prisma init

dev:
	npm run dev

build:
	npm run build  # Add "build": "tsc" to package.json

test:
	npm test

migrate:
	npx prisma migrate dev

generate:
	npx prisma generate

lint:
	npx eslint src --ext .ts

format:
	npx prettier --write src

ci: lint test
