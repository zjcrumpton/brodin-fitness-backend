build:
	docker build -t ${tag} .
clean:
	docker rmi -f ${tag}
run:
	docker run -d -p ${port}:${port} --name ${name} ${tag}

pg:
	docker run -p 5432:5432 -e POSTGRES_PASSWORD=password postgres

db:
	npx sequelize-cli db:create

migrate:
	npx sequelize-cli db:migrate