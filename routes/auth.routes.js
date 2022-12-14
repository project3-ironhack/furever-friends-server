const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");

// ℹ️ Handles password encryption
const jwt = require("jsonwebtoken");

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Adopter = require("../models/Adopter.model");
const Association = require("../models/Association.model");

// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// POST /auth/signup  - Creates a new user in the database
router.post("/signup", (req, res, next) => {
  const {
    email,
    password, 
    name,
    telephone,
    city,
    type
  } = req.body;
  const { home, yardAccess, hasKids, hasPets } = req.body;
  const { website, associationType, image } = req.body;

  // Check if email or password or name are provided as empty strings
  if (email === "" || password === "" || name === "") {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  // This regular expression check that the email is of a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // This regular expression checks password for special characters and minimum length
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // Check the users collection if a user with the same email already exists
  User.findOne({ email })
    .then((foundUser) => {
      // If the user with the same email already exists, send an error response
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      // If email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const newUser = {
        email,
        password: hashedPassword,
        name,
        telephone,
        city,
        type
      };

      const adopterKind = { home, yardAccess, hasKids, hasPets };
      const associationKind = { website, associationType, image };
    
      const newAdopter = { ...newUser, ...adopterKind }
      const newAssociation = { ...newUser, ...associationKind };

      // Create the new user in the database
      // We return a pending promise, which allows us to chain another `then`
      if(type === 'adopter'){
        return Adopter.create(newAdopter)
      }
  

      if(type === 'association'){
        return Association.create(newAssociation)
      }
    })
    .then((createdUser) => {
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      console.log(createdUser)
      const { email, name, _id } = createdUser;

      // Create a new object that doesn't expose the password
      const user = { email, name, _id };

      // Send a json response containing the user object
      res.status(201).json({ user: user });
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// Get list of user info from model
const enums = [
  ['/signup/types', User, 'type'],
  ['/signup/associationtype', Association, 'associationType'],
  ['/signup/home', Adopter, 'home'],
  ['/signup/haspets', Adopter, 'hasPets'],
]

for (const array of enums) {
  let [path, model, key] = array;
  router.get(path, (req, res) => {
      res.json(model.schema.path(key).enumValues)
  });
}

// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password are provided as empty string
  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  // Check the users collection if a user with the same email exists
  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        // If the user is not found, send an error response
        res.status(401).json({ message: "User not found." });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, email, name } = foundUser;

        // Create an object that will be set as the token payload
        const payload = { _id, email, name };

        // Create a JSON Web Token and sign it
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        // Send the token as the response
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and is made available on `req.payload`
  console.log(`req.payload`, req.payload);

  // Send back the token payload object containing the user data
  res.status(200).json(req.payload);
});

// Get list of users
router.get('/signup', (req, res, next) => {
    User.find()
    .then(allUsers => {
        res.json(allUsers);
    })
    .catch(err => {
        console.log("error getting list of users", err);
        res.status(500).json({message: "error getting list of users", error: err})
    });
});

// Retrieve a specific user by id 
router.get('/:userId', (req, res, next) =>{
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
  }

  User.findById(userId)
      .then(user => res.json(user))
      .catch(err => {
          console.log("error getting user details...", err);
          res.status(500).json({
              message: "error getting user details...",
              error: err
          })
      });
});

// Update a specific user by id
router.put('/:userId', (req, res, next) => {
  const { userId } = req.params;
  const { type } = req.body;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
  }

  if ( type === 'adopter'){
  Association.findByIdAndUpdate(userId, req.body, { new: true })
      .then((updatedUser) => {res.json(updatedUser)
      console.log(updatedUser)
      })
      .catch(err => {
          console.log("error updating association...", err);
          res.status(500).json({
              message: "error updating association...",
              error: err
          })
      });
  }

  if ( type === 'adopter'){
      Adopter.findByIdAndUpdate(userId, req.body, { new: true })
          .then((updatedUser) => {res.json(updatedUser)
          })
          .catch(err => {
              console.log("error updating adopter...", err);
              res.status(500).json({
                  message: "error updating adopter...",
                  error: err
              })
          });
      }

});

// Delete a specific user by id
router.delete('/signup/:userId', (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  User.findByIdAndRemove(userId)
    .then(() => {
      res.json({ message: `Pet with ${userId} is removed successfully.` })
    })
    .catch(err => {
      console.log("error deleting user...", err);
      res.status(500).json({ message: "error deleting user...", error: err });
    });
});

module.exports = router;
