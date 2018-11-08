// ----------------------------------------------------------------------------------------------------------
// Mongoose set-up
// ----------------------------------------------------------------------------------------------------------

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const data = require("./data.js");

const recipeSchema = new Schema(
  {
    title: String,
    level: {
      type: String,
      enum: ["Easy Peasy", "Amateur Chef", "UltraPro Chef"]
    },
    ingredients: Array,
    cuisine: String,
    dishType: {
      type: String,
      enum: ["Breakfast", "Dish", "Snack", "Drink", "Dessert", "Other"]
    },
    image: {
      type: String,
      default: "https://images.media-allrecipes.com/images/75131.jpg"
    },
    duration: {type: Number, max: 144},
    creator: String,
    created: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

// ----------------------------------------------------------------------------------------------------------
// Database connection and queries
// ----------------------------------------------------------------------------------------------------------

mongoose
  .connect(
    "mongodb://localhost/recipeApp",
    { useNewUrlParser: true }
  )
  .then(() => Recipe.insertMany(data))
  .then(() => Promise.all([updateRigatoni, deleteCarrotCake]))
  .then(() => mongoose.connection.close())
  .catch(err => console.error('ERROR IN PROMISE CHAIN', err.message))


  const updateRigatoni = Recipe.findOneAndUpdate(
    { title: { $eq: "Rigatoni alla Genovese" } },
    { $set: { duration: 145 } },
    { runValidators: true, new: true}
  )

  const deleteCarrotCake = Recipe.findOneAndDelete({ title: "Carrot Cake" })

