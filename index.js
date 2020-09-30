const { Sequelize, DataTypes } = require('sequelize');
const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
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
  'Second Year': {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  UROS: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  'Third Year': {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  'Third Year Team Project': {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  tunetype: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  'Fourth Year': {
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
sequelize.sync({ force: false });

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.set('port', (process.env.PORT || 4000));

app.post('/session_id', async (req, res) => {
  var sessionID = crypto.randomBytes(20).toString('hex');
  await SessionInfo.create({ sessionID });
  res.send(sessionID);
});

app.post('/send_session_info', async (req, res) => {
    console.log(req.body)
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
      [sequelize.fn('to_char', sequelize.fn('AVG', sequelize.col('UROS')), 'FM999999999.00'), 'UROS'],
      [sequelize.fn('to_char', sequelize.fn('AVG', sequelize.col('UROS')), 'FM999999999.00'), 'UROS'],
      [sequelize.fn('to_char', sequelize.fn('AVG', sequelize.col('Welcome')), 'FM999999999.00'), 'Welcome'],
      [sequelize.fn('to_char', sequelize.fn('AVG', sequelize.col('Timeline')), 'FM999999999.00'), 'Timeline'],
      [sequelize.fn('to_char', sequelize.fn('AVG', sequelize.col('Second Year')), 'FM999999999.00'), 'Second Year'],
      [sequelize.fn('to_char', sequelize.fn('AVG', sequelize.col('Third Year')), 'FM999999999.00'), 'Third Year'],
      [sequelize.fn('to_char', sequelize.fn('AVG', sequelize.col('Third Year Team Project')), 'FM999999999.00'), 'Third Year Team Project'],
      [sequelize.fn('to_char', sequelize.fn('AVG', sequelize.col('Fourth Year')), 'FM999999999.00'), 'Fourth Year'],
      [sequelize.fn('to_char', sequelize.fn('AVG', sequelize.col('tunetype')), 'FM999999999.00'), 'tunety.pe'],
      [sequelize.fn('to_char', sequelize.fn('AVG', sequelize.col('Analytics')), 'FM999999999.00'), 'Analytics'],
    ],
  });
  res.send(averages);
});
const port =  process.env.PORT || 4000 
app.listen(port,  () => {
  console.log(`Example app listening at localhost:${port}`)
})
