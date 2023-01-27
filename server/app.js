const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

const app = express();
dotenv.config();

// environment variables
const PORT = process.env.PORT_NUMBER || 9999;
const CLIENT_URL = process.env.CLIENT_BASE_URL;
const DB_URL = process.env.MONGODB_URL;

// routes
const indexRoutes = require('./routes/index.js');

app.use(
  cors({
    origin: '*',
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.use('/', indexRoutes);

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_BASE_URL,
  },
});
require('./config/socket')(io);

mongoose.set('strictQuery', true);
mongoose.connect(
  DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Database connected');
      httpServer.listen(PORT, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Server running on http://localhost:${PORT}`);
        }
      });
    }
  }
);
