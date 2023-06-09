# La Petite Patisserie


## [See the App!](https://lapetitepatisserie.netlify.app/)
## Description

Last project developed during Ironhack web development bootcamp.
La Petite Patisserie is a really simple app where people can check pastry related recipes or create and account and upload their own recipes.

#### [APP CLIENT](https://github.com/CeciliaTorreira/la-petite-patisserie-client)
#### [SAPP SERVER](https://github.com/CeciliaTorreira/la-petite-patisserie-server)

## Backlog Functionalities
Apart from the simple functionalities the app already has, I would like to add a "copy recipe" functionality so users can copy and adapt a specific recipe to their liking.
A friend system. Users would be able to search for friends and add them to a list so they can easily check what their friends are uploading or commenting.

## Technologies user

HTML, CSS, JavaScript, Express, React, React Context, Axios

# Server Structure

## Models 
 User model
 ```javascript
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    favouriteRecipes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
  },
  {
   
    timestamps: true,
  }
  ```
  Recipe model
  
  ```javascript
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
      required: true,
    },
  },
  {
    timestamps: true,
  }
  ``` 
  Comment model
  ```javascript
  {
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    recipe: { type: Schema.Types.ObjectId, ref: "Recipe" },
  },
  {
    timestamps: true,
  }
);
  ```
 
  ## API endpoints (PENDING)
  | HTTP Method | URL                                    | Request Body                                                | Success status | Error Status  | Description                                                   |
| ----------- | ---------------------------              | ----------------------------                                  | -------------- | ------------ | -------------------------------------------------------------- |
| POST        | `/auth/signup`                           | {name, email, password}                                       | 201            | 400          | Registers the user in the Database                             |
| POST        | `/auth/login`                            | {username, password}                                          | 200            | 400          | Validates credentials, creates and sends Token                 |
| GET         | `/auth/verify`                           |                                                               | 200            | 401          | Verifies the user Token                                        |
| GET         | `/profile`                               |                                                               | 200            | 400          | Shows active user's profile                                    |
| GET         | `/profile/favourite`                     |                                                               | 201            | 400          | Shows active user's favourite recipes                          |
| GET         | `/profile/created`                       |                                                               | 200            | 400          | Shows active user's created recipes                            |
| GET         | `/recipes`                               |                                                               | 200            | 400          | Shows all the existing recipes in the DB                       |
| POST        | `/recipes/create`                        | {name, ingredients, category, instructions, serving, picture} | 200            | 401          | Creates a new recipe in the DB                                 |
| GET         | `/recipes/:recipeId`                     |                                                               | 200            | 401          | Shows a specific recipe by its ID                              |
| PUT         | `/recipes/:recipeId`                     | {name, ingredients, category, instructions, serving, picture} | 200            | 400, 401     | Edits a specific recipe                                        |
| DELETE      | `/recipes/:recipeId`                     |                                                               | 200            | 401          | Deletes a specific recipe                                      |
| POST        | `/recipes/:recipeId/favourite`           |                                                               | 200            | 401          | Adds a recipe to the active user's favourite list              |
| POST        | `/recipes/:recipeId/remove`              |                                                               | 200            | 401          | Removes a recipe from the active user's favourite list         |
| GET         | `/recipes/:recipeId/comments `           |                                                               | 200            |              | Shows all the comments made on a recipe page                   |
| POST        | `/recipes/:recipeId/comments`            | {description, creator(payload), rating, recipeId}             | 200            |              | Creates a new comment in the DB                                |
| DELETE      | `/recipes/:recipeId/comments/:commentId` |                                                               | 200            |              | Deletes a comment from the DB                                  | 
  
  
  ### Slides
  
  pending
