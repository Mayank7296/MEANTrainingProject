var User = require('../models/user');
var Item = require('../models/items');
var jwt = require('jsonwebtoken');
var secret='supersecrettokenrequiredhereforextrasecurity';

module.exports= function(router){

  //user registration route
router.post('/users',function(req,res){
    //  res.send('Testing the route connection');
      var user = new User();
      user.name = req.body.name;
      user.password = req.body.password;
      user.email = req.body.email;
      user.phone = req.body.phone;
      if(req.body.phone == null || req.body.password == null || req.body.email == null || req.body.phone == "" || req.body.password == "" || req.body.email == ""){
        //res.send("Please ensure that you've provided Mobile Number, Password and email address");
        res.json({success:false, message: 'Please ensure that you have provided Mobile Number, Password and email address'})
      }
      else{
        user.save(function(err){
          if(err){
        //    res.send('Phone Number or Email Already Exists'+err);
              res.json({success: false, message:"Phone Number or Email Already Exists"})
          }
          else{
            //res.send('user Created');
            res.json({success: true, message: "User successfully Created"});
          }
        });
      }

    });
    //user login route
    //api/authenticate
    router.post('/authenticate', function(req,res){
      //res.send("Testing new route");
      User.findOne({phone: req.body.phone}).select('name password phone email').exec(function(err, user){
        if (err) throw err;

        if(!user){
          res.json({success: false, message: 'couldnot authenticate user'});
        }
        else if (user) {
          //Password validation happens here
          if(req.body.password){
            var validPassword = user.comparePassword(req.body.password);
          }
          else{
            res.json({success: false, message:'No password Provided'});
          }
          if(!validPassword){
            res.json({success:false, message: 'couldnot authenticate password'});
          }else{
            var token = jwt.sign({phone: user.phone, email:user.email}, secret, { expiresIn: '1h' });

            res.json({success:true, message: 'User Authenticatied', token: token});
          }

        }
      });

    });



router.use(function(req,res,next){
  var token = req.body.token || req.body.query || req.headers['x-access-token'];
if(token){
  //verify Token
  // verify a token symmetric
  jwt.verify(token, secret, function(err, decoded) {
    if(err){
      res.json({success: false, message: 'Token Invalid'})
    }
    else {
      req.decoded=decoded;
      next();
    }
  });

}
else {
  res.json({success: false, message: 'No Token Provided'});
}

});

router.post('/me',function(req,res){
  res.send(req.decoded);

});

//
// //item adding router
// router.post('/itemPost',function(req,res){
//     // res.send('Testing the route connection');
//         var item = new Item();
//         item.name = req.body.name;
//         item.email = req.body.email;
//         item.phone = req.body.phone;
//         item.title = req.body.title;
//         item.description = req.body.description;
//         item.price = req.body.price;
//         if(req.body.phone == null || req.body.price == null || req.body.email == null || req.body.title == null || req.body.phone == "" || req.body.price == "" || req.body.email == "" || req.body.title== ""  ){
//           //res.send("Please ensure that you've provided Mobile Number, Password and email address");
//           res.json({success:false, message: 'Please ensure that all the required fields are set'})
//         }
//         else{
//           item.save(function(err){
//             if(err){
//           //    res.send('Phone Number or Email Already Exists'+err);
//                 res.json({success: false, message:"Please enter proper date"})
//             }
//             else{
//               //res.send('user Created');
//               res.json({success: true, message: "items successfully Created"});
//             }
//           });
//         }
//
//        });

    //item search route
    return router;
}
