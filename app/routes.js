module.exports = function(app, passport, db, mongoose) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('wallet').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            messages: result
          })
        })
    });



// message board routes ===============================================================

    app.post('/messages', (req, res) => {
      db.collection('wallet').save({acct: req.body.acct, ar : req.body.ar, ap: req.body.ap}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    app.put('/messages', (req, res) => {

      db.collection('wallet')
      .findOneAndUpdate({acct: req.body.acct, ar : req.body.ar, ap: req.body.ap}, {
        $set: {
          // thumbUp:req.body.thumbUp + 1
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })


    app.delete('/yummy', (req, res) => {
      console.table(req.body)
      db.collection('wallet').findOneAndDelete({acct: req.body.acct, ar : req.body.ar, ap: req.body.ap}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


//getting total calorie count on server side
    app.get('/currentBal', (req, res) => {
      let total = 0;
      let totalAr = 0;
      let totalAp = 0;

      db.collection('wallet').find().toArray( (error, result) => {
        result.forEach( el => {
          let elAr = parseFloat(el.ar);
          let elAp = parseFloat(el.ap);
          elAr = !isNaN(elAr) ? elAr : 0
          elAp = !isNaN(elAp) ? elAp : 0
          console.log(elAr);
          console.log(elAp);
          console.log('\n');
          totalAr += elAr
          totalAp += elAp
        });
        console.log(`TotalAP: ${totalAp}`);
        console.log(`TotalAR: ${totalAr}`);
        console.log(`Total: ${totalAr - totalAp}`);
        res.write(JSON.stringify({
          balTotal: (totalAr - totalAp)
        }));
        //end the resp
        res.end()
      });
    });


    app.put('/messages2', (req, res) => {
      db.collection('wallet')
      .findOneAndUpdate({acct: req.body.acct, ar : req.body.ar, ap: req.body.ap}, {
        $set: {
          // thumbUp:req.body.thumbUp - 1,
        }
      }, {
    //code below ensures that
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    // app.delete('/messages', (req, res) => {
    //   db.collection('yummy').findOneAndDelete({food: req.body.food, calorie: req.body.calorie, date: req.body.date}, (err, result) => {
    //     if (err) return res.send(500, err)
    //     res.send('Message deleted!')
    //   })
    // })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });


        // app.get('/total',function(){
        //
        //   db.collection('yummy').sum({req.body.calorie})
        // });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
