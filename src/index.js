const express = require('express');
const bodyParser = require('body-parser');

const { PORT } = require('./config/serverConfig');
const apiRoutes = require('./routes/index');

// const UserService = require('./services/user-service');

const app = express();

const prepareAndStartServer = () => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/api', apiRoutes);

    app.listen(PORT, async () => {
        console.log('Server Started on PORT', PORT);

        // const service = new UserService();
        // const newToken = service.createToken({ email: 'amitesh@gmail.com', id: 1 });
        // console.log('New Token:', newToken);

        // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFtaXRlc2hAZ21haWwuY29tIiwiaWQiOjEsImlhdCI6MTc3OTMwNDc3MywiZXhwIjoxNzc5MzA0ODAzfQ.nl6iCbwi4o7h5V7bFSaLUTwPcxgjTryorQbgXfeUYX8'
        // const response = service.verifyToken(token);
        // console.log('Token Response:', response);
    });

}

prepareAndStartServer();