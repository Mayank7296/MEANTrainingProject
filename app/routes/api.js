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
              res.json({success: false, message:"Write Appropriate data"})
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


//item adding router
router.post('/itemPost',function(req,res){
    // res.send('Testing the route connection');
        var item = new Item();
        item.name = req.body.name;
        item.email = req.body.email;
        item.phone = req.body.phone;
        item.title = req.body.title;
        item.description = req.body.description;
        item.price = req.body.price;
        item.img = req.body.img;
        if(req.body.phone == null || req.body.price == null || req.body.email == null || req.body.title == null || req.body.phone == "" || req.body.price == "" || req.body.email == "" || req.body.title== ""  ){
          //res.send("Please ensure that you've provided Mobile Number, Password and email address");
          res.json({success:false, message: 'Please ensure that all the required fields are set'})
        }
        else{
          item.save(function(err){
            if(err){
          //    res.send('Phone Number or Email Already Exists'+err);
                res.json({success: false, message:"Please enter proper date"})
            }
            else{
              //res.send('user Created');
              res.json({success: true, message: "items successfully Created"});
            }
          });
        }

       });

//Routing for reloign after Session
router.get('/renewToken/:phone', function(req, res){
  User.findOne({ phone: req.params.phone }).select().exec(function(err, user){
    if(err) throw err;
    if(!user) {
      res.json({ success: false, message: 'No user found' });
    }else{
      var newtoken = jwt.sign({phone: user.phone, email:user.email}, secret, { expiresIn: '1h' });
      res.json({success:true, message: 'User Authenticatied', token: newtoken});
    }
  });
});

    //item search route
    router.get('/itemUpdate',function(req, res){
      Item.find({ phone: req.decoded.phone }, function(err, item){
        if(err) throw err;
          if(!item){
            res.json({success: false, message: 'No Items Found'});
          }else{
            res.json({ success: true, item: item});
          }
        });
      });
      router.get('/itemShow',function(req, res){
        Item.find({ phone: { $ne: req.decoded.phone } }, function(err, items){
          if(err) throw err;
            if(!items){
              res.json({ success: false, message: 'No Items Found'});
            }else{
              res.json({ success: true, items: items});
            }
          });
        });

        //Deleting items from database

        router.delete('/itemDelete/:_id', function(req, res){
          var deletedItem = req.params._id;
          Item.findOne({ _id: deletedItem }, function(err, item){
            if(err) throw er;
            if(!item){
              res.json({success: false, message:'no item found to delete'});
            }else{
              Item.findOneAndRemove({ _id: deletedItem }, function(err, mainItem){
                if(err) throw err;
                res.json({success: true});
              });
            }
          });
        });

          router.get('/edit/:id', function(req, res){
            var id = req.params.id;
            console.log(id);
             Item.findOne({_id: id}, function(err, item){
               if(err) throw err;
               if(!item){
                 res.json({ success: false, message: 'No Item Found' });
               }else{
                  res.json({ success: true, item: item });
               }
             });

          });

          router.put('/edit', function(req, res) {
            var id = req.body._id;

            if(req.body.title) var newTitle = req.body.title;
            if(req.body.description) var newDescription = req.body.description;
            if(req.body.price) var newPrice = req.body.price;
            if(req.body.image) var newImage = req.body.image;
            if(req.body.valid) var newValid = req.body.valid;
            //console.log(id + "::::" + newValid);
            if(newTitle){
                Item.findOne({ _id: id }, function(err, item){
                  if(err) throw err;
                  if(!item){
                    res.json({sucess: false, message: 'No Item Found'});
                  } else{
                    item.title = newTitle;
                    item.save(function(err){
                      if(err) {
                        console.log(err);
                      }else{
                        res.json({success: true, message: 'Title Has been Updated'});
                      }
                    });
                  }
                });
            }
            if(newDescription){
                Item.findOne({ _id: id }, function(err, item){
                  if(err) throw err;
                  if(!item){
                    res.json({sucess: false, message: 'No Item Found'});
                  } else{
                    item.description = newDescription;
                    item.save(function(err){
                      if(err) {
                        console.log(err);
                      }else{
                        res.json({success: true, message: 'Description Has been Updated'});
                      }
                    });
                  }
                });
            }
            if(newPrice){
                Item.findOne({ _id: id }, function(err, item){
                  if(err) throw err;
                  if(!item){
                    res.json({sucess: false, message: 'No Item Found'});
                  } else{
                    item.price = newPrice;
                    item.save(function(err){
                      if(err) {
                        console.log(err);
                      }else{
                        res.json({success: true, message: 'Title Has been Updated'});
                      }
                    });
                  }
                });
            }
             if(newImage){
                Item.findOne({ _id: id }, function(err, item){
                  if(err) throw err;
                  if(!item){
                    res.json({sucess: false, message: 'No Item Found'});
                  } else{
                    item.image = newImage;
                    item.save(function(err){
                      if(err) {
                        console.log(err);
                      }else{
                        res.json({success: true, message: 'Title Has been Updated'});
                      }
                    });
                  }

                });
            }
            if(newValid){

                Item.findOne({ _id: id }, function(err, item){
                  if(err) throw err;
                  if(!item){
                    res.json({sucess: false, message: 'No Item Found'});
                  } else{
                    item.valid = newValid;
                    item.save(function(err){
                      if(err) {
                        console.log(err);
                      }else{
                        res.json({success: true, message: 'Title Has been Updated'});
                      }
                    });
                  }
                });
            }

          });

    return router;
}
