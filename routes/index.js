var express = require('express');
var router = express.Router();
var mandrill = require('node-mandrill')('krVca0LJhCc72qdKzCdqsg');
var fs = require('fs');
var formidable = require('formidable');
var util = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(__dirname+"/public/index.html");
});

router.post('/send',function(req,res,next){
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    var data=null,
        buf=null,
        base64CVData=null,
        base64PPData=null,
        base64FormData=null;
    try{
      data = fs.readFileSync(files.CV.path);
      buf = new Buffer(data);
      base64CVData = buf.toString("base64");
      data = fs.readFileSync(files.PP.path);
      buf = new Buffer(data);
      base64PPData = buf.toString("base64");

      var formData = "First Name : "+fields.FNAME+
        "\nMiddle Name : "+fields.MNAME+
        "\nLast Name : "+fields.LNAME+
        "\nEmail : "+fields.EMAIL+
        "\nMobile Number : "+fields.MOBILE1+" , "+fields.MOBILE2+
        "\nSex : "+fields.MMERGE5+
        "\nAddress : "+fields.ADDRESS+
        "\nCity : "+fields.CITY+
        "\nState: "+fields.STATE+
        "\nCountry : "+fields.COUNTRY+
        "\nPincode : "+fields.PINCODE+
        "\nPortfolio : "+fields.PORT+
        "\nWork Experience : "+fields.WORKEXP+" years"+
        "\nExpected Salary : "+fields.EXPSALARY+
        "\nReference/comments/questions : "+fields.COMMENTS;

      buf= new Buffer(formData);
      base64FormData = buf.toString("base64");
    }catch(e){
    console.log(e);
    }

    

    mandrill('/messages/send', {
      message: {
        to: [{email:fields.EMAIL, name: fields.FNAME+" "+fields.LNAME}],
        from_email: 'no_reply@swaayattrobots.in',
        subject: "Confirmation Mail",
        text: "Hello "+fields.FNAME+",\nThis mail is to inform you that we have received your application.\nWe will contact you soon.\n\n\n\nIf you received this email by mistake, simply delete it."
      }
    }, function(error, response){
      if (error) console.log( JSON.stringify(error) );

      else console.log(response);
    });

    mandrill('/messages/send', {
      message: {
        to: [{email:"vrbalaji16@gmail.com", name: "Balaji VR Reddy"}],
        from_email: fields.EMAIL,
        from_name: fields.FNAME+" "+fields.LNAME,
        subject: "Application and Resume",
        text: "Hello,\nI filled a form on your website and the data I just entered is magically mailed to you as attachments.\n\nPlease have a look into it !!!",
        "attachments": [{
          "type": "application/pdf",
          "name": fields.FNAME+"_"+fields.LNAME+"_cv.pdf",
          "content": base64CVData
        },{
          "type": "application/pdf",
          "name": fields.FNAME+"_"+fields.LNAME+"_pp.pdf",
          "content": base64PPData
        },{
          "type": "text/plain",
          "name": fields.FNAME+"_"+fields.LNAME+"_form_data.txt",
          "content": base64FormData
        }]
      }
    }, function(error, response){
      if (error) console.log( JSON.stringify(error) );

      else console.log(response);
    });
     res.sendFile(__dirname+"/public/result.html")
  });
});
module.exports = router;

