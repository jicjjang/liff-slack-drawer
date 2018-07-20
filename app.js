const express = require('express');
const proxy = require('http-proxy-middleware');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 8002;

const config = require('./config');

app.use(bodyParser.json());

// [routes]
app.post('/api', async (req, res, next) => {
  const base64Image = req.body.data.base64Image;

  let splitedBase64Image = base64Image.split(';base64,').pop();
  return fs.writeFile('temp/image.png', splitedBase64Image, { encoding: 'base64' }, function(err) {
    console.log('<< File created >>');
    return axios
      .post(
        'https://slack.com/api/chat.postMessage',
        JSON.stringify({
          channel: config.channel,
          attachments: [
            {
              text: '낙서장',
              image_url: 'http://liff-slack-drawer-app.herokuapp.com/temp/image.png'
            }
          ]
        }),
        {
          headers: {
            Authorization: config.Authorization,
            'Content-type': 'application/json'
          }
        }
      )
      .then(res => {
        return res;
      })
      .catch(e => {
        return res;
      });
  });
});

app.use(
  '/slack',
  proxy({
    target: 'https://slack.com/api',
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/slack': ''
    }
  })
);
app.use('/static', express.static(__dirname + '/build/static'));
app.use('/temp', express.static(__dirname + '/temp'));
app.use('/', express.static(__dirname + '/build'));

// [error]
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    code: err.status || 500,
    message: err.message || 'Server error'
  });
});

const server = app.listen(port, () => {
  // console.log('Express listening on port', port)
});
