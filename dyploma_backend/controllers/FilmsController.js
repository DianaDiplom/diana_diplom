const neo4j = require('neo4j-driver');
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '12345'));
const paginate = require('jw-paginate');

exports.getAllFilms = async (req, res) => {
  try {
      const query = `MATCH (n:Movie) RETURN n`;
      const session = driver.session();
      let result = [];
      await session.run(query, {})
          .then(function(res) {
              res.records.forEach(record => {
                  result.push(record._fields[0].properties);
              })
          })
          .catch(function(err) {
              console.log(err);
              res.status(400).json(err)
          });
      await function(){
          const page = parseInt(req.query.page) || 1;
          const pageSize = 16;
          const pager = paginate(result.length, page, pageSize);

          const pageOfItems = result.slice(pager.startIndex, pager.endIndex + 1);
          res.json({pager, pageOfItems})
      }();
  }
  catch (err) {
        res.status(400).json(err);
    }
};

exports.getMovieById = async (req, res) => {
    try {
        const { movieId } = req.params;
        const session = driver.session();
        session.run(`MATCH (n:Movie) WHERE n.id = '${movieId}' RETURN n`)
            .then(result => res.json(result.records[0]._fields[0].properties))
            .catch(err => res.status(400).json(err));
    }
    catch(err) {
        res.status(400).json(err);
    }
};

exports.rateMovie = async (req, res) => {
  try {
      const { movieId } = req.params;
      const { token, value } = req.body;
      const session = driver.session();
      session.run(`MATCH (n:User { token: '${token}'})-[r]->(m:Movie { id: '${movieId}'}) RETURN r`)
          .then(result => {
              if (result.records.length === 0) {
                  const session = driver.session();
                  session.run(`MATCH (n:User), (m:Movie) 
                                     WHERE n.token = '${token}' AND m.id = '${movieId}'
                                     CREATE (n)-[r:RATED { rate: ${value}}]->(m)`)
                      .then(result => res.json({value: value}))
                      .catch(err => {
                          console.log(err);
                          res.status(400).json(err);
                      })
              }
              else {
                  const session = driver.session();
                  session.run(`MATCH (n:User { token: '${token}'})-[r]->(m:Movie { id: '${movieId}'})
                                     SET r.rate = '${value}'`)
                      .then(result => res.json({value: value}))
                      .catch(err => res.status(400).json(err))
              }
          })
          .catch(err => {
              console.log(err);
              res.status(400).json(err)
          })
  }
  catch (err) {
      res.status(400).json(err);
  }
};

exports.getUserRatedMovieById = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { token } = req.query;
        const session = driver.session();
        session.run(`MATCH (n:User { token: '${token}'})-[r]->(m:Movie { id: '${movieId}'}) RETURN r`)
            .then(result => res.json({value: result.records[0]._fields[0].properties.rate}))
            .catch(err => res.status(400).json(err));
    }
    catch (err) {
        res.status(400).json(err)
    }
};

exports.getUserRecommendationsBySimilarity = async (req, res) => {
    try {
        const { token } = req.query;
        console.log(token);
        const session = driver.session();
        let resultFilms = [];
        await session.run(`MATCH (p1:User {token: '${token}'})-[rated:RATED]->(movie:Movie)
                            WITH p1, gds.alpha.similarity.asVector(movie, toFloat(rated.rate)) AS p1Vector
                            MATCH (p2:User)-[rated:RATED]->(movie:Movie) WHERE p2 <> p1
                            WITH p1, p2, p1Vector, gds.alpha.similarity.asVector(movie, toFloat(rated.rate)) AS p2Vector
                            RETURN p1.email AS from,
                                   p2.email AS to,
                                   gds.alpha.similarity.pearson(p1Vector, p2Vector, {vectorType: "maps"}) AS similarity
                            ORDER BY similarity DESC`)
            .then(async result => await Promise.all(result.records.splice(0,3).map(user => {
                if(user._fields[2] > 0)
                {
                    const session = driver.session();
                    return session.run(`MATCH (d:User {email: '${user._fields[1]}'})-[r:RATED]->(m:Movie)
                                        WHERE r.rate > 3.5
                                        RETURN m`)
                        .then(async matchForSimilarUserResult => {
                            await Promise.all(matchForSimilarUserResult.records.map(record => {
                                const session = driver.session();
                                console.log(token);
                                console.log(record._fields[0].properties.id);
                                return session.run(`MATCH (n:User {token: '${token}'})-[:RATED]->(m:Movie {title: '${record._fields[0].properties.title}'}) 
                                RETURN m`)
                                    .then(matchForMyUserResult => {
                                        if (matchForMyUserResult.records.length === 0) {
                                            resultFilms.push(record._fields[0].properties);
                                        }
                                    })
                                    .catch(err => console.log(err))
                            }));
                        })
                        .catch(err => console.log(err))
                }
            })))
            .catch(err => console.log(err));
        await res.json(resultFilms.length > 15 ? resultFilms.slice(0,16) : resultFilms);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err)
    }
};

exports.getSearch = async (req, res) => {
    try {
        let { search } = req.query;
        search = search.charAt(0).toUpperCase() + search.slice(1).toLowerCase();
        const session = driver.session();
        const result = [];
        await session.run(`MATCH (m:Movie) WHERE m.title CONTAINS '${search}' RETURN m`)
            .then(res => {
                res.records.forEach(item => {
                    result.push(item._fields[0].properties)
                })
            })
            .catch(err => res.status(400).json(err));
        await res.json(result);
    }
    catch (err) {
        res.status(400).json(err);
    }
};

