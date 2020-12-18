const { Sequelize, DataTypes } = require('sequelize');
const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    dialect: 'postgres',
    protocol: 'postgres',
    port: 5432,
    host: 'https://rocky-beyond-02836.herokuapp.com/',
    logging: true, //false
  },
  query: {
    raw: true,
  },
});
const SessionInfo = sequelize.define('SessionInfo', {
  sessionID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Welcome: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  Timeline: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  Rpgym: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  UROS: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  tunetype: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  Analytics: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
});
sequelize.sync();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.set('port', process.env.PORT || 4000);

app.post('/session_id', async (req, res) => {
  var sessionID = crypto.randomBytes(20).toString('hex');
  await SessionInfo.create({ sessionID });
  res.send(sessionID);
});

app.post('/send_session_info', async (req, res) => {
  console.log(req.body);
  if (req.body && req.body.sessionID) {
    const { sessionID } = req.body;
    await SessionInfo.update({ ...req.body, tunetype: req.body['tunety.pe'] }, { where: { sessionID } });
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.post('/averages', async (req, res) => {
  const averages = await SessionInfo.findOne({
    attributes: [
      [sequelize.fn('AVG', sequelize.col('UROS')), 'UROS'],
      [sequelize.fn('AVG', sequelize.col('Welcome')), 'Welcome'],
      [sequelize.fn('AVG', sequelize.col('Timeline')), 'Timeline'],
      [sequelize.fn('AVG', sequelize.col('tunetype')), 'tunety.pe'],
      [sequelize.fn('AVG', sequelize.col('Analytics')), 'Analytics'],
      [sequelize.fn('AVG', sequelize.col('Rpgym')), 'Rpgym'],
    ],
  });
  res.send(averages);
});
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Example app listening at localhost:${port}`);
});
