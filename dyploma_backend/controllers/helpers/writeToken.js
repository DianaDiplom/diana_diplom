const neo4j = require('neo4j-driver');
const crypto = require('crypto');
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '12345'));

exports.writeUserToken = async (email, response) => {
    try {
        let token = '';
        const session = driver.session();
        crypto.randomBytes(24, function(err, buffer) {
            token = buffer.toString('hex');
            session.run(`MATCH (n:User) WHERE n.email CONTAINS '${email}' SET n.token = '${token}'`, {})
                .then(res => {
                    response.json({token: token})
                })
                .catch(err => {
                    response.status(400).json(err);
                })
        });
    }
    catch (err) {
        response.status(400).json(err);
    }
};