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
    duration: Number,
    creator: String,
    created: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

// ----------------------------------------------------------------------------------------------------------
// Database connection
// ----------------------------------------------------------------------------------------------------------

mongoose
  .connect(
    "mongodb://localhost/recipeApp",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected to Mongo!");
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

// ----------------------------------------------------------------------------------------------------------
// DB queries
// ----------------------------------------------------------------------------------------------------------

Recipe.insertMany(data)
  .then(recipeArr => {
    console.log(`${recipeArr.length} recipes created!`);

    //once our 5 recipes have been created in the database, then we run our updateRecipeList function,
    return updateRecipeList();
  })
  .then(values => {
    console.log(values);

    // once our 2 promises inside the updateRecipeList function have resolved, then we close the database
    mongoose.connection.close(() => console.log("Connection closed"));
  })
  .catch(err => console.error(err));

// Promise.all allow us to run several database queries at the same time
function updateRecipeList() {
  const updateRigatoni = Recipe.findOneAndUpdate(
    { title: { $eq: "Rigatoni alla Genovese" } },
    { $set: { duration: 100 } }
  )
    .then(recipeDoc => {
      console.log(`${recipeDoc.title} updated`);
      return recipeDoc;
    })
    .catch(err => {
      console.error("update rigatonni failed");
      return err;
    });

  const deleteCarrotCake = Recipe.findOneAndDelete({ title: "Carrot Cake" })
    .then(recipeDoc => {
      console.log(recipeDoc.title + " removed");
      return recipeDoc;
    })
    .catch(err => {
      console.error(err);
      return err;
    });

  return Promise.all([updateRigatoni, deleteCarrotCake]);
}
