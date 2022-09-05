# Short Infos

This application will allow login with user create/remove/update/fetch Short Infos.

- Each Info Infos can optionally have an attachment image.

- Each user only has access to Infos Infos that he/she has created.

- List Short infos other users.




## Demo

![plot](./assets/demo.gif)


## Installation

###  Client Interface - Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.


To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

### Backend: deploy application serverless

in backend directory on docker-compose.yml set variables AWS and run docker-compose to build image:

```sh
AWS_ACCESS_KEY_ID: [...]
AWS_SECRET_KEY: [...]


docker-compose -f docker-compose.yml build
```





