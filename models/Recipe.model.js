const { Schema, model } = require("mongoose");

const recipeSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: false,
    },
    ingredients: {
      type: [String],
      required: true,
      trim: true,
    },
    category: {
      type: [String],
      required: true,
      enum: ["vegan", "vegetarian", "gluten free", "dairy free", "general"],
      default: "general",
    },
    instructions: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    servings: {
      type: Number,
      required: true,
    },
    picture: {
    type: String,
    required: true
  }
  },
  {
    timestamps: true,
  }
);

const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;
