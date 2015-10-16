var express = require('express');
var router = express.Router();
var mandrill = require('node-mandrill')('krVca0LJhCc72qdKzCdqsg');
var fs = require('fs');
var formidable = require('formidable');
var util = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/send',function(req,res,next){
  var form = new formidable.IncomingForm();

      form.parse(req, function(err, fields, files) {
        var data = fs.readFileSync(files.cv.path);
        var buf = new Buffer(data);
        var base64Data = buf.toString("base64");

            mandrill('/messages/send', {
              message: {
                to: [{email:fields.email, name: 'Sudar Abisheck'}],
                from_email: 'no_reply@mandrilltest.com',
                subject: "Confirmation Mail",
                text: "Hello 'someone',\nThis mail is to inform you that we have received your application.\nWe will contact you soon.\n\n\n\nIf you received this email by mistake, simply delete it.",
                "attachments": [{
                  "type": "text/plain",
                  "name": "cv.pdf",
                  "content": base64Data
                }]
              }
            }, function(error, response)
            {
              if (error) console.log( JSON.stringify(error) );

              else console.log(response);
            });
            res.writeHead(200, {'content-type': 'text/html'});
            res.write('<h1 style="color:green; font:sans-serif; text-align:center">:) Thank you for considering us</h1><p style="text-align:center"> we will contact you soon.</p>');
            res.end();
          });
});
module.exports = router;
