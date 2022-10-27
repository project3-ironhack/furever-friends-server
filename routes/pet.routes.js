const router =  require("express").Router();
const mongoose = require('mongoose');

const  Pet = require('../models/Pet.model');
const Dog = require('../models/Dog.model');
const Cat = require('../models/Cat.model');
const Association = require('../models/Association.model'); 

const { isAuthenticated } = require('../middleware/jwt.middleware');


//Create a new pet 

router.post('/pets', (req, res, next) => {
    const { petName, 
        birthday, 
        ageType, 
        weight, 
        description, 
        petFriendly, 
        kidFriendly, 
        furLength, 
        location, 
        isNeutered, 
        isVaccinated, 
        image, 
        adoptionWith,
        typeOfPet
    } = req.body;

    const { catRace } = req.body;
    const { dogRace, size } = req.body;

    const newPet = {
        petName,
        birthday, 
        ageType, 
        weight, 
        description, 
        petFriendly, 
        kidFriendly, 
        furLength, 
        location, 
        isNeutered, 
        isVaccinated, 
        image, 
        adoptionWith
    };

    const catType = { catRace };
    const dogType = {dogRace, size};

    const newCat = {...newPet, ...catType };
    const newDog = {...newPet, ...dogType };

    if( typeOfPet === 'Dog'){
        Dog.create(newDog)
        .then(response => res.json(response))
        .catch(err => {
            console.log("error creating a new dog...", err);
            res.status(500).json({
                message:"error creating a new dog",
                error: err
            })
        });
         
    }   
  
 
    if ( typeOfPet === 'Cat') {
        Cat.create(newCat)
        .then(response => res.json(response))
        .catch(err => {
            console.log("error creating a new cat...", err);
            res.status(500).json({
                message:"error creating a new cat",
                error: err
            })
        });
    
    }
    
});

// Get list of pets

router.get('/pets', (req, res, next) => {
    Pet.find()
    .then(allPets => {
        res.json(allPets)
    })
    .catch(err => {
        console.log("error getting list of pets", err);
        res.status(500).json({ message: "error getting list of pets", error: err})
    });
});


// Retrieve a specific pet by id 

router.get('/pets/:petId', (req, res, next) =>{
    const { petId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(petId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Pet.findById(petId)
        .then(pet => res.json(pet))
        .catch(err => {
            console.log("error getting pet details...", err);
            res.status(500).json({
                message: "error getting pet details...",
                error: err
            })
        });

});


// Update a specific Pet by id

router.put('/pets/:petId',  (req, res, next) => {
    const { petId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(petId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Pet.findByIdAndUpdate(petId, req.body, { new: true })
        .then((updatedPet) => res.json(updatedPet))
        .catch(err => {
            console.log("error updating pet...", err);
            res.status(500).json({
                message: "error updating pet...",
                error: err
            })
        });
});


// Delete a specific pet by id
router.delete('/pets/:petId', (req, res, next) => {
    const { petId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(petId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Pet.findByIdAndRemove(petId)
        .then(() => res.json({ message: `Pet with ${petId} is removed successfully.` }))
        .catch(err => {
            console.log("error deleting pet...", err);
            res.status(500).json({
                message: "error deleting pet...",
                error: err
            })
        });
});



module.exports = router;


