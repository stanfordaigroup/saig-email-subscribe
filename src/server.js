const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa-cors');
const koaBody = require('koa-body');
const nodeFetch = require('node-fetch');

const port = process.env.PORT || 8080;

const app = new Koa();
const router = new Router();

app.use(cors())
.use(router.routes())
.use(router.allowedMethods());

function encode(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

function submitSubscription(email) {
  nodeFetch('https://mailman.stanford.edu/mailman/subscribe/saig-announce', {
    method: 'POST',
    headers: {
      'Origin': 'https://mailman.stanford.edu',
    },
    body: encode({
      'digest': '0',
      'email-button': 'Subscribe',
      'email': email,
      'fullname': '',
    }),
  }).then((response) => console.log('subscribed email:', email))
    .catch((error) => console.error(error));
}

router.post('/subscribe', koaBody(),
  (ctx) => {
    const body = JSON.parse(ctx.request.body);
    
    submitSubscription(body.email);
    
    // => POST body
    ctx.body = JSON.stringify(ctx.request.body);
  }
);


router.get('/', async (ctx) => {
  ctx.body = {
    status: 'success',
    message: 'hello, world!'
  };
})

console.log(`Now listening for subscription requests on port ${port}... 🚇`)

app.listen(port);