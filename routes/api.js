const router = require("express").Router();
const {Workout} = require("../models/index.js");

const WORKOUT_RANGE_LIMIT = 7; // number of workouts to return with /api/workouts/range

// handler for getting all workouts
router.get("/api/workouts", (req, res) => {
  Workout.aggregate(
    [
      { $sort: { day: 1, _id: 1 } },
      { $addFields: { totalDuration: { $sum: "$exercises.duration"} } }
    ]
  ).then(workoutData => {
    res.json(workoutData);
  })
  .catch(err => {
    res.status(400).json(err);
  });
});

// handler for getting range of past several workouts (specified by constant WORKOUT_RANGE_LIMIT)
router.get("/api/workouts/range", (req, res) => {
  Workout.aggregate(
    [
      { $sort: { day: -1, _id: -1 } },
      { $limit: WORKOUT_RANGE_LIMIT },
      { $sort: { day: 1, _id: 1 } },
      { $addFields: { totalDuration: { $sum: "$exercises.duration"} } }
    ]
  ).then(workoutData => {
    res.json(workoutData);
  })
  .catch(err => {
    res.status(400).json(err);
  });
});


// handler for creating a new workout
router.post("/api/workouts", ({ body }, res) => {
  Workout.create(body)
    .then(workoutData => {
      res.json(workoutData);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// handler for adding exercises to a workout
router.put("/api/workouts/:id", (req, res) => {
  Workout.findOne({ _id: req.params.id})
  .then(workout => {
    workout.exercises.push(req.body)
    workout.save((err) => {
      if (err) {
        res.status(400).json(err);
      }
      res.json(workout);
    })
  })
});



module.exports = router;
