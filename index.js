const mongoose = require('mongoose');
const express = require('express');
const app = express();
const Joi = require('joi');
const config = require('config');
Joi.objectId = require('joi-objectid')(Joi);
const home = require('./routes/home');
const roles = require('./routes/roles');
const users = require('./routes/adminUsers');
const accountStatuses = require('./routes/accountStatuses');
const customers = require('./routes/customers');
const auth = require('./routes/auth');
var cors = require('cors');
app.use(cors());
//jwtPrivateKey is required for json web tokens
// $env: MarkoVoice_jwtPrivateKey = mySecureKey;
// if (!config.get('jwtPrivateKey')) {
// 	console.error('FATAL ERROR: jwtPrivateKey is not defined.');
// 	process.exit(1);
// }
/** connect with db */
mongoose
	.connect('mongodb://admin1:admin123@mycluster-shard-00-00.c89un.mongodb.net:27017,mycluster-shard-00-01.c89un.mongodb.net:27017,mycluster-shard-00-02.c89un.mongodb.net:27017/devConnectorDatabase?ssl=true&replicaSet=MyCluster-shard-0&authSource=admin&retryWrites=true&w=majority')
	.then(() => console.log('Connected to MongoDB...'))
	.catch(() => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/', home);
app.use('/api/roles', roles);
app.use('/api/users', users);
app.use('/api/status', accountStatuses);
app.use('/api/customers', customers);
app.use('/api/auth', auth);

const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`Listening on Port ${port}...`));
