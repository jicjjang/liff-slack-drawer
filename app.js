const express = require('express');
const proxy = require('http-proxy-middleware');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

const { port, Authorization } = require('./config');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/build'));

// [routes]
app.use('/image', express.static(__dirname + '/images'));
app.post('/send_image', function(req, res, next) {
  const base64Image = req.body.data.base64Image;
  const channel = req.body.data.channel;
  if (!channel) {
    res.status(500).send('Please insert validated channel id.\nOnly public channels are available.');
  }
  let splitedBase64Image = base64Image.split(';base64,').pop();
  const currentTime = new Date().getTime();
  fs.writeFileSync('images/image' + currentTime + '.png', splitedBase64Image, {
    encoding: 'base64'
  });

  _validateChannelId(channel).then(function(isValidate) {
    if (!isValidate) {
      res.status(500).send('Please insert validated channel id.\nOnly public channels are available.');
      return;
    }

    _postMessage(
      req.headers.origin,
      channel,
      currentTime,
      function(result) {
        console.log('success');
        res.send(result.data.ok);
        return result;
      },
      function(e) {
        console.log('error');
        res.status(500).send('Please insert validated channel id.\nOnly public channels are available.');
        return e;
      }
    );
    return;
  });
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/build/index.html');
});

// [Deprecated] proxy
// app.use(
//   '/slack',
//   proxy({
//     target: 'https://slack.com/api',
//     changeOrigin: true,
//     secure: false,
//     pathRewrite: {
//       '^/slack': ''
//     }
//   })
// );

// [Error]
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    code: err.status || 500,
    message: err.message || 'Server error'
  });
});

// [Server]
app.listen(process.env.PORT || port, () => {
  console.log('Express listening on port', port);
});

///////////////////////////////////////////////////////////////////

function _validateChannelId(channel) {
  return axios
    .get('https://slack.com/api/conversations.list?token=' + Authorization + '&pretty=1')
    .then(function(result) {
      const channels = result.data.channels;
      let validate = false;

      for (let i = 0; i < channels.length; i++) {
        if (channel === channels[i].id) {
          validate = true;
          break;
        }
      }
      return validate;
    });
}

function _postMessage(url, channel, currentTime, successFunc, failFunc) {
  return axios
    .post(
      'https://slack.com/api/chat.postMessage',
      JSON.stringify({
        channel: channel,
        attachments: [
          {
            text: '낙서장',
            image_url: url + '/image/image' + currentTime + '.png'
          }
        ]
      }),
      {
        headers: {
          Authorization: 'Bearer ' + Authorization,
          'Content-type': 'application/json'
        }
      }
    )
    .then(successFunc)
    .catch(failFunc);
}
