const Get = require('./get');
const Insert = require('./insert');
const Update = require('./update');
const Delete = require('./delete');

const createURL = require('../utils').createURL;
const fetchAsync = require('../utils').fetchAsync;

class Mongo {
  constructor(appId, url, options) {
    this.appId = appId
    this.url = url
    this.options = options
  }

  get(collection) {
    return new Get(this.appId, collection, this.url, this.options);
  }

  insert(collection) {
    return new Insert(this.appId, collection, this.url, this.options);
  }

  update(collection) {
    return new Update(this.appId, collection, this.url, this.options);
  }

  delete(collection) {
    return new Delete(this.appId, collection, this.url, this.options);
  }

  profile() {
    let url = createURL(`${this.url}v1/auth/profile`);
    return fetchAsync(url, Object.assign({}, this.options, { method: 'GET' }));
  }

  signIn(email, pass) {
    let url = createURL(`${this.url}v1/auth/email/signin`);
    let body = JSON.stringify({ email, pass });
    return fetchAsync(url, Object.assign({}, this.options, { method: 'POST', body: body }));
  }

  signUp(email, name, pass, role) {
    let url = createURL(`${this.url}v1/auth/email/signup`);
    let body = JSON.stringify({ email, pass, name, role });
    return fetchAsync(url, Object.assign({}, this.options, { method: 'POST', body: body }));
  }
}

const generateFind = (condtion) => {
  switch (condtion.type) {
    case 'and':
      return condition.clauses.reduce((prev, curr) => Object.assign({}, prev, generateFind(curr)), {})

    case 'or':
      newConds = condtion.clauses.map(cond => generateFind(cond))
      return { '$or': newConds }

    case 'cond':
      switch (condtion.op) {
        case "==":
          return { [f1]: f2 };
        case ">":
          return { [f1]: { $gt: f2 } };
        case "<":
          return { [f1]: { $lt: f2 } };
        case ">=":
          return { [f1]: { $gte: f2 } };
        case "<=":
          return { [f1]: { $lte: f2 } };
        case "!=":
          return { [f1]: { $ne: f2 } };
      }

  }
}

exports.mongoURL = (prefix, appId, collection, params = {}) => {
  let url = `${prefix}v1/mongo/${appId}/${collection}`;
  return createURL(url, params)
};

exports.generateFind = generateFind
exports.Mongo = Mongo