const { Sequelize, DataTypes } = require('sequelize');
const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser')
const cors = require('cors')
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite',
  query: {
    raw: true
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
  'tunety.pe': {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
});
sequelize.sync({force: true})

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/session_id', async (req, res) => {
  var sessionID = crypto.randomBytes(20).toString('hex');
  await SessionInfo.create({ sessionID })
  res.send(sessionID)
});

app.post('/send_session_info', async (req, res) => {
  if (req.body && req.body.sessionID){
    const {sessionID} = req.body
    await SessionInfo.update(req.body, { where: {sessionID} });
    res.sendStatus(200)
  }
  else{
    res.sendStatus(404)
  }
});
app.post('/averages', async (req, res) => {
  res.send(
    SessionInfo.findAll({
      attributes: [[models.sequelize.fn('AVG', models.sequelize.col('Welcome')), 'Welcome'][(models.sequelize.fn('AVG', models.sequelize.col('Second Year')), 'Second Year')][(models.sequelize.fn('AVG', models.sequelize.col('UROS')), 'UROS')][(models.sequelize.fn('AVG', models.sequelize.col('Third Year')), 'Third Year')][(models.sequelize.fn('AVG', models.sequelize.col('Third Year Team Project')), 'Third Year Team Project')][(models.sequelize.fn('AVG', models.sequelize.col('tunety.pe')), 'tunety.pe')]],
      group: ['venueId'],
      order: [[models.sequelize.fn('AVG', models.sequelize.col('rating')), 'DESC']],
    })
  );
});

const port  = process.env.PORT | 4000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
