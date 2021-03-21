const neo4j = require('neo4j-driver');
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '12345'));
const writeToken = require('./helpers/writeToken');

exports.createUser = async (req, res) => {
    const { email, password, nickname, age} = req.body;
  try {
      const query =
          `CREATE (n:User) SET n.email = '${email}', n.password = '${password}', n.age = '${age}', n.nickname = '${nickname}'`;
      const session = driver.session();

      session.run(query, {})
          .then(function(result) {
              writeToken.writeUserToken(req.body.email, res);
          })
          .catch(function(err) {
              console.log(err);
              res.status(400).json(err)
          });

  }
  catch (err) {
      res.send(err);
  }
};

exports.authUser = (req, res) => {
    try {
        const query =
            `MATCH (n:User) WHERE n.email CONTAINS '${req.body.email}' RETURN n`;
        const session = driver.session();

        session.run(query, {})
            .then(function(result) {
                console.log(result);
                const data = result.records[0]._fields[0].properties;
                if (data.password !== req.body.password) res.status(400).json('Incorrect username or password.');
                else {
                    writeToken.writeUserToken(req.body.email, res);
                }
            })
            .catch(function(err) {
                console.log(err);
                res.status(400).json(err)
            });

    }
    catch (err) {
        res.status(400).json(err)
    }
};

exports.getInfo = (req, res) => {
    try {
        const { token } = req.query;
        const session = driver.session();
        session.run(`MATCH (n:User) WHERE n.token = '${token}' RETURN n`)
            .then(response => {
                if (!response.records[0]) res.status(400).send('No such user');
                else {
                    res.json(response.records[0]._fields[0].properties);
                }
            })
            .catch(err =>  {
                console.log(err);
                res.status(400).json(err)
            })
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err)
    }
};