const Koa = require('koa');
const Router = require('@koa/router');
const topicsRouter = require('./api/topics');
const notesRouter = require('./api/notes');
const topicConfigsRouter = require('./api/topicConfigs');
const topicStatsRouter = require('./api/topicStats');
const app = new Koa();
const router = new Router();

const koaSwagger = require('koa2-swagger-ui').koaSwagger;
const swaggerJSDoc = require('swagger-jsdoc');

// Swagger definition
const swaggerDefinition = {
    info: {
        title: 'Node.js Swagger API', // Title of the documentation
        version: '1.0.0', // Version of the app
        description: 'This is the REST API for my product', // short description of the app
    },
    host: 'localhost:3000', // the host or url of the app
    basePath: '/api', // the basepath of your endpoint
};

// options for the swagger docs
const options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./src/api/**/*.js'], // pass all in array 
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

app.use(koaSwagger({
  routePrefix: '/swagger', // host at /swagger instead of default /docs
  swaggerOptions: {
    url: 'http://localhost:3000/swagger.json', // example path to json
  },
}));

app.use(async (ctx, next) => {
  if (ctx.path === '/swagger.json') {
    ctx.body = swaggerSpec;
  } else {
    await next();
  }
});

router.use('/api', topicsRouter.routes());
router.use('/api', notesRouter.routes());
router.use('/api', topicConfigsRouter.routes());
router.use('/api', topicStatsRouter.routes());

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);