build:
	docker build -t ${tag} .
clean:
	docker rmi -f ${tag}
run:
	docker run -d -p ${port}:${port} --name ${name} ${tag}

pg:
	docker run -p 5432:5432 -e POSTGRES_PASSWORD=password -e POSTGRES_HOST_AUTH_METHOD=trust -e POSTGRES_USER=postgres postgres 

db:
	npx sequelize-cli db:create && NODE_ENV=test npx sequelize-cli db:create

test:
	DB_USER=postgres DB_PASSWORD=password DB_NAME=brodin-test DB_HOST=0.0.0.0 npm run test

migrate:
	npx sequelize-cli db:migrate