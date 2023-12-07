const Router = require('@koa/router');
const notesController = require('./controllers/notesController');
const router = new Router();

router.get('/notes', notesController.getAll);
router.get('/notes/:id', notesController.getById);
router.post('/notes', notesController.create);
router.put('/notes/:id', notesController.update);
router.delete('/notes/:id', notesController.delete);

module.exports = router;