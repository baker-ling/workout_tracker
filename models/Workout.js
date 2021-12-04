const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  type: {
    type: String,
    trim: true,
    required: "Specify a type of exercise: 'cardio' or 'resistance'",
    enum: ['cardio', 'resistance']
  },
  name: {
    type: String,
    trim: true,
    required: "Specify a name for the exercise (e.g. 'benchpress', 'elliptical')"
  },
  duration: {
    type: Number,
    min: 0,
    required: "Specify a duration for the exercise"
  },
  distance: {
    type: Number,
    min: 0,
    required: function() {
      return (this.type === 'cardio' ? 'You must specify a distance for cardio workouts' : false);
    }
  },
  weight: {
    type: Number,
    min: 0,
    required: function() {
      return (this.type === 'resistance' ? 'You must specify a weight for resistance workouts' : false);
    }
  },
  sets: {
    type: Number,
    min: 0,
    required: function() {
      return (this.type === 'resistance' ? 'You must specify the number of sets for resistance workouts' : false);
    }
  },
  reps: {
    type: Number,
    min: 0,
    required: function() {
      return (this.type === 'resistance' ? 'You must specify the number of reps for resistance workouts' : false);
    }
  }
});

const workoutSchema = new Schema({
  day: {
    type: Date,
    required: "Specify a date for the workout",
    default: Date.now
  },
  exercises: [exerciseSchema]
});

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;
