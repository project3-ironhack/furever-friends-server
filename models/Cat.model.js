const {Schema} = require("mongoose")
const Pet = require("./Pet.model")

const catSchema = new Schema({
    catRace: {
        type: String,
        enum: [
            "Abyssinian",
            "Bengal",
            "Birman",
            "Bombay",
            "British Shorthair",
            "Burmese",
            "Chartreux",
            "Cornish Rex",
            "Devon Rex",
            "Domestic Shorthair",
            "Domestic Mediumhair",
            "Domestic Longhair",
            "Egyptian Mau",
            "Exotic Shorthair",
            "Havana Brown",
            "Himalayan",
            "Japanese Bobtail",
            "Maine Coon",
            "Manx",
            "Mixed",
            "Munchkin",
            "Norwegian Forest",
            "Ocicat",
            "Oriental",
            "Persian",
            "Ragdoll",
            "Russian Blue",
            "Savannah",
            "Scottish Fold",
            "Siamese",
            "Siberian",
            "Somali",
            "Sphynx",
            "Tonkinese",
            "Turkish Angora",
            "Turkish Van",
            "Other",
            "Unknown",
        ],
        default: "Unknown",
    },
})


const Cat = Pet.discriminator("Cat", catSchema);

module.exports = Cat;
