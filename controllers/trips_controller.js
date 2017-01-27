const express = require("express");
const Trip = require("../models/trip");
const passport = require('../config/ppConfig');
const router = express.Router();
const flash = require("connect-flash");
const isLoggedIn = require('../middleware/isLoggedIn');

// router.get('/', function(req, res) {
//   res.render('trips/index');
// });

router.get('/create', isLoggedIn, function(req, res) {
  if (!req.user.isAdmin) {// to ensure that only admin is able to make changes
    return res.redirect("/")
  }
  res.render('trips/create');
});

router.get('/:tripId/edit', isLoggedIn, function(req, res) {
  if (!req.user.isAdmin) {// to ensure that only admin is able to make changes
    return res.redirect("/")
  }
  Trip.findById(req.params.tripId, function(err, trip){
    if (err) throw err;
    res.render("trips/edit", { trip : trip });
  })
});

router.post('/:tripId/edit', isLoggedIn, function(req, res) {
  if (!req.user.isAdmin) {// to ensure that only admin is able to make changes
    return res.redirect("/")
  }
  let newTrip = {
    country: req.body.country,
    packageNumber: req.body.packageNumber,
  };
  Trip.findByIdAndUpdate(req.params.tripId, newTrip, function(err, trip){
    if (err) throw err;
    res.redirect("/trips");
  })
});

router.get("/", function(req, res) {
  Trip.find({}, function(err, trips){
    if (err) throw err;
    res.render("trips/index", { trips : trips });
  })
});


router.post("/create", isLoggedIn, function(req, res){
  if (!req.user.isAdmin) {// to ensure that only admin is able to make changes
    return res.redirect("/")
  }
  let newTrip = new Trip({
    country: req.body.country,
    packageNumber: req.body.packageNumber,
  })
  newTrip.save(function (err, savedEntry){
    if (err) throw err;
    res.redirect("/trips")
  })
})
// for joining trips
router.post("/:tripId/join", isLoggedIn, function(req, res){
  for (var i=0; i<req.user.tripsBooked.length; i++){
    if (req.user.tripsBooked[i].id == req.params.tripId){
      req.flash('error', 'You have already signed up for this trip');
      res.redirect('/trips')
      return //forces to look trhough the whole array to check first before carrying out the push
    }
  }
  req.user.tripsBooked.push(req.params.tripId);
  req.user.save(function (err, savedUser){
    if (err) throw err;
    req.flash('success', 'You have signed up for this trip');
    res.redirect("/trips")
  })
});

router.post("/:tripId/leave", isLoggedIn, function(req, res){
  for (var i=0; i<req.user.tripsBooked.length; i++){
    if (req.user.tripsBooked[i].id == req.params.tripId){
      req.user.tripsBooked.splice(i, 1)
      req.user.save(function (err, savedUser){
        if (err) throw err;
        req.flash('success', 'You have opted out of this trip');
        res.redirect("/trips")
      })
      return //forces to look trhough the whole array to check first before carrying out the push
    }
  }
  req.flash('error', 'You have not signed up for this trip');
  res.redirect('/trips')
})
router.post("/:tripId/delete", isLoggedIn, function(req, res) {
  if (!req.user.isAdmin) {// to ensure that only admin is able to make changes
    return res.redirect("/")
  }
    Trip.findByIdAndRemove(req.params.tripId, function (err, tripItem) {
      if (err) throw err;
      res.redirect("/trips")
    })
  })


module.exports = router
