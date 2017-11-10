const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const nodeFetch = require('node-fetch');

const port = process.env.PORT || 8080;

const app = new Koa();
const router = new Router();

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
    // @ts-ignore
    const body = ctx.request.body;

    submitSubscription(body);

    ctx.body = JSON.stringify(body);
  }
);

router.get('/', async (ctx) => {
  ctx.body = {
    status: 'success',
    message: 'hello, world!'
  };
})

console.log('Now listening for subscription requests... 🚇')

app.use(router.routes())
   .use(router.allowedMethods());

app.listen(port);