const { Sequelize, DataTypes } = require('sequelize');
const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite',
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
      [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('UROS')), 1), 'UROS'],
      [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('Welcome')), 1), 'Welcome'],
      [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('Timeline')), 1), 'Timeline'],
      [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('Second Year')), 1), 'Second Year'],
      [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('Third Year')), 1), 'Third Year'],
      [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('Third Year Team Project')), 1), 'Third Year Team Project'],
      [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('Fourth Year')), 1), 'Fourth Year'],
      [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('tunetype')), 1), 'tunety.pe'],
      [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('Analytics')), 1), 'Analytics'],
    ],
  });
  res.send(averages);
});
const port =  process.env.PORT || 4000 
app.listen(port,  () => {
  console.log(`Example app listening at localhost:${port}`)
})
