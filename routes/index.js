var express = require('express');
var router = express.Router();
var mandrill = require('node-mandrill')('krVca0LJhCc72qdKzCdqsg');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/send',function(req,res,next){
  mandrill('/messages/send', {
      message: {
              to: [{email: 'sudarabisheck@gmail.com', name: 'Sudar Abisheck'}],
              from_email: 'hello@mandrilltest.com',
              from_name: "Armin",
              subject: "Hey, what's up?",
              text: "Hello, I sent this message using mandrill."
          }
  }, function(error, response)
  {
      //uh oh, there was an error
        if (error) console.log( JSON.stringify(error) );
    
            //everything's good, lets see what mandrill said
                else console.log(response);
                });
  res.end("Message has been sent");
});
module.exports = router;
