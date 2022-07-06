require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const userRoute = require('./routes/user.route');

//App Config
const app = express();

//Middleware
app.use(express.json());

//DB Config
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((conn) => {
    console.log(
      `Mongodb Connected to: ${conn.connection.host}, ${conn.connection.name} on PORT ${conn.connection.port} `
    );
  })
  .catch((err) => {
    console.log('Failed to connect to MongoDB,\nError: ', err.message);
  });

app.use('/api', userRoute);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname + '../', 'client', 'build', 'index.html')
    )
  );
} else {
  app.get('/', (req, res) => {
    res.send('Server is running...');
  });
}

//Listener
app.listen(process.env.PORT, () =>
  console.log(
    `Server running on PORT ${process.env.PORT}\nLocal:\thttp://localhost:${process.env.PORT}`
  )
);
