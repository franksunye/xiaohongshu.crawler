const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser'); // add this line

const topicLogsRouter = require('./api/topicLogs');
const noteLogsRouter = require('./api/noteLogs');
const topicConfigsRouter = require('./api/topicConfigs');
const topicStatsRouter = require('./api/topicStats');
const app = new Koa();
app.use(bodyParser());

const router = new Router();

const koaSwagger = require('koa2-swagger-ui').koaSwagger;
const swaggerJSDoc = require('swagger-jsdoc');

console.log("Starting server.js");

// Swagger definition
const swaggerDefinition = {
    info: {
        title: 'Node.js Swagger API', // Title of the documentation
        version: '1.0.0', // Version of the app
        description: 'This is the REST API for my product', // short description of the app
    },
    host: 'localhost:3000', // the host or url of the app
    basePath: '/api', // the basepath of your endpoint
    components: {}, // add this line

};

// options for the swagger docs
const options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./src/api/**/*.js'], // pass all in array 
    // apis: [], // 暂时移除文件


};

console.log("Initializing Swagger");

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

console.log("Swagger initialized");

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

console.log("Setting up routes");

router.use('/api', topicLogsRouter.routes());
router.use('/api', noteLogsRouter.routes());
router.use('/api', topicConfigsRouter.routes());
router.use('/api', topicStatsRouter.routes());

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Starting to listen on port 3000");

app.listen(3000);