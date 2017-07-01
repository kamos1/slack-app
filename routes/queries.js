const typeCheck = require('../helpers/typeCheck');
const textCleaner = require('../helpers/textCleaner');
const userCleaner = require('../helpers/userCleaner');
const validateInput = require('../helpers/validateInput');

const ModelBase = require('../db/modelbase');

const User = ModelBase.extend({
  tableName: 'users',
  outcomes: () => this.hasMany(Outcome),
});

const Outcome = ModelBase.extend({
  tableName: 'outcomes',
  users: () => this.belongsTo(User),
  outcome_types: () => this.belongsTo(Outcome_Type)
});

const Outcome_Type = ModelBase.extend({
  tableName: 'outcome_types',
  outcomes: () => this.hasMany(Outcome)
});

const add = (request, response) => {
  const text = request.body.text.split(' ');
  const url = request.response_url;

  const validate = validateInput(text[0]);
  if (validate === 'You made a mistake') {
    return response.status(500).send({text: 'You made a mistake'})
  }

  const type = textCleaner(text[0]);
  const slackId = textCleaner(text[1]);
  const userInfo = slackId.split('|');
  const userId = userCleaner(userInfo[0]);
  const username = userCleaner(userInfo[1]);

  const body = {
    response_type: "in_channel",
    text: `*${slackId} recieved a ${type}*`
  };

  User.findOrCreate({ slack_id: slackId, username: username, user_id: userId })
        .then((user) => {Outcome.create({user_id: user.id, outcome_types_id: typeCheck(type)})
        })
        .then(() => response.status(200).send(body))
        .catch((error) => response.status(500).send(error))
}

const check = (request, response) => {
  const text = request.body.text.split(' ');
  const type = textCleaner(text[0]);
  const user = textCleaner(text[1]);
  console.log(user);

  new User({slack_id: user})
    .fetch()
    .then((user) => Outcome.findAll({user_id: user.id, outcome_types_id: typeCheck(type)}))
    .then((outcomes) => response.status(200)
      .send({text: `*${user} has ${outcomes.length} ${type}*`}))
    .catch((error) => response.status(500).send(error))
}

const getWins = (request, response) => {
  const user = request.query.username;
  const type = 'win';

  new User({username: user})
  .fetch()
  .then((user) => Outcome.findAll({user_id: user.id, outcome_types_id: typeCheck(type)}))
  .then((outcomes) => response.status(200)
  .send({text: `${user} has ${outcomes.length} ${type}s`}))
  .catch((error) => response.status(500).send(error))
}

const getLosses = (request, response) => {
  const user = request.query.username;
  const type = 'loss';

  new User({username: user})
  .fetch()
  .then((user) => Outcome.findAll({user_id: user.id, outcome_types_id: typeCheck(type)}))
  .then((outcomes) => response.status(200)
  .send({text: `${user} has ${outcomes.length} ${type}es`}))
  .catch((error) => response.status(500).send(error))
}

module.exports = {
  add: add,
  check: check,
  getWins: getWins,
  getLosses: getLosses
}
