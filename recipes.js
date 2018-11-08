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
    duration: {type: Number},
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


const updateRigatoni = Recipe.findOneAndUpdate(
  { title: 'Rigatoni alla Genovese' }, 
  { duration: 100 },
  { runValidators: true, new: true }
)

const deleteCarrotCake = Recipe.findOneAndDelete(
  {title: 'Carrot Cake'}
  );

  
async function handleRecipes(){
  try {
    const allRecipes = await Recipe.insertMany(data);
    //console.log('Successfully created the recipes', allRecipes)
    const [rigatoniDoc, carrotCakeDoc] = await Promise.all([updateRigatoni, deleteCarrotCake])
    //console.log('Successfully updated 1 recipe and deleted 1 recipe', rigatoniDoc, carrotCakeDoc)
    return [ allRecipes, rigatoniDoc, carrotCakeDoc ]
  } catch(err) {
    throw new Error("ERROR handling the recipes :(", err.message)
  }
  
}

function closeConnection (){
  try {
    mongoose.connection.close();
    console.log('connection closed');
  } catch(err){
    throw new Error("ERROR closing the connection", err.message)
  }

}

async function recipeQueries(){
  mongoose.connect( "mongodb://localhost/recipeApp", { useNewUrlParser: true });
  const [ allRecipes, rigatoniDoc, carrotCakeDoc ] = await handleRecipes();
  closeConnection();
  return [ allRecipes, rigatoniDoc, carrotCakeDoc ]
}


recipeQueries()