const db = require('../database/models');
const path = require('path')


const Movies = db.Movie;
const Genres = db.Genre;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll({
            include: ['genre']
        })
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },

    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id,
        {
            include: ['genre']
        })
        .then(movie => {
            res.render('moviesDetail.ejs', {movie})
        })
    },

                    // CRUD

                        add: function (req, res) {
                            let promGenres = Genres.findAll();
                        
                            Promise.all([promGenres])
                            .then(([allGenres]) => {
                                return res.render(path.resolve(__dirname, '..', 'views', 'moviesAdd'), { allGenres });
                            })
                            .catch(error => {
                                console.error('Error al buscar géneros:', error);
                                return res.status(500).send('Error interno del servidor');
                            });
                        }, 
                        
                        create: function (req, res) {
                            Movies.create({
                                title: req.body.title,
                                rating: req.body.rating,
                                awards: req.body.awards,
                                release_date: req.body.release_date,
                                length: req.body.length,
                                genre_id: req.body.genre_id
                            })
                            .then(() => {
                                return res.redirect('/movies');
                            })
                            .catch(error => {
                                console.error('Error al crear película:', error);
                                return res.status(500).send('Error interno del servidor');
                            });
                        },

                        edit: function(req,res) {
                            let movieId = req.params.id;
                            let promMovies = Movies.findByPk(movieId,{include: ['genre']});
                            let promGenres = Genres.findAll();
                            Promise
                            .all([promMovies, promGenres])
                            .then(([Movie, allGenres]) => {
                                Movie.release_date = moment(Movie.release_date).format('L');
                                return res.render(path.resolve(__dirname, '..', 'views',  'moviesEdit'), {Movie,allGenres})})
                            .catch(error => res.send(error))
                        },
                    
                        update: function (req,res) {
                            let movieId = req.params.id;
                            Movies.update(
                                {
                                    title: req.body.title,
                                    rating: req.body.rating,
                                    awards: req.body.awards,
                                    release_date: req.body.release_date,
                                    length: req.body.length,
                                    genre_id: req.body.genre_id
                                },
                                {
                                    where: {id: movieId}
                                })
                            .then(()=> {
                                return res.redirect('/movies')})            
                            .catch(error => res.send(error))
                        }
                    
                                
}

module.exports = moviesController;