const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const axios = require('axios');
const neo4j = require('neo4j-driver');
const { getGenreById }  = require('./helpers/getGenreById');
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '12345'));

const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/films');

const app = express();
const session = driver.session();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', usersRouter);
app.use('/movies', moviesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen('8080', err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`
    ################################################
    🛡️  Server listening on port: ${'8080'} 🛡️ 
    ################################################
  `);
});

//4c8f0c5631b0a707d0b8958d9bbc201a
//GET films data for neo4j


for (let i = 1950; i < 2021; i++) {
  const session = driver.session();
  session.run(`CREATE (n:Year) SET n.year = ${i}`)
};

//for

for (let i = 0; i < 1; i++ ) {
  axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=4c8f0c5631b0a707d0b8958d9bbc201a&language=en-US`)
      .then(res => {
        res.data.results.forEach(movie => {
          console.log(movie.title);
          movie.title = movie.title.toString().replace(/"/g, '\\"');
          movie.overview = movie.overview.toString().replace(/"/g, '\\"');

          const session = driver.session();
          session.run(`CREATE (n:Movie) SET n.title = "${movie.title}", n.id = "${movie.id}", n.poster_path = "${movie.poster_path}", n.backdrop_path = "${movie.backdrop_path}", n.overview = "${movie.overview}", n.release_date = "${movie.release_date}"`, {})
              .then(res => {
                 const session = driver.session();
                 const spliceYear = movie.release_date.slice(0,4);
                 session.run(`MATCH (n:Movie), (y:Year) WHERE n.release_date = "${movie.release_date}" AND n.id = "${movie.id}" AND y.year = ${spliceYear} CREATE (n)-[r:FILMED_IN]->(y)`)
                   .then(res => {})
                   .catch(err => console.log(err))
                movie.genre_ids.forEach(genre => {
                  const genreName = getGenreById(genre);
                  const session = driver.session();
                  session.run(`MATCH (n:Movie), (g:Genre) WHERE n.title = "${movie.title}" AND g.name = "${genreName}" CREATE (n)-[r:GENRE_IN]->(g)`)
                      .then(res => {})
                      .catch(err =>  {console.log(err)})
                })
              })
              .catch(console.error);
        })
      })
      .catch(console.error);
}


module.exports = app;
