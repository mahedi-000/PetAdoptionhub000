const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

//const users = require('./routes/users');
const shelters = require('./routes/shelters');
const pets = require('./routes/pets');
const adoptions = require('./routes/adoptions');
const appointments = require('./routes/appointments');
const reviews = require('./routes/reviews');
//const petview = require('./routes/petview');
const auth=require('./routes/auth');
const admin = require('./routes/admin');


app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", auth);
//app.use('/api/users', users);
app.use('/api/admin', admin);
app.use('/api/shelters', shelters);
app.use('/api/pets', pets);
//app.use('/api/petview', petview);
app.use('/api/adoptions', adoptions);
app.use('/api/appointments', appointments);
app.use('/api/reviews', reviews);


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
