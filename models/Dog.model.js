const {Schema} = require("mongoose")
const Pet = require("./Pet.model")

const dogSchema = new Schema({
    dogRace: {
        type: String,
        enum: [
            "Affenpinscher",
            "Afghan Hound",
            "Airedale Terrier",
            "Akita",
            "Alaskan Malamute",
            "Australian Cattle Dog",
            "Australian Sheperd",
            "Australian Terrier",
            "Basset Hound",
            "Beagle",
            "Bedlington Terrier",
            "Belgian Shepherd",
            "Bernese Mountain Dog",
            "Bichon Frise",
            "Bloodhound",
            "Border Collie",
            "Border Terrier",
            "Borzoi",
            "Boston Terrier",
            "Boxer",
            "British Bulldog",
            "Bull Terrier",
            "Bullmastiff",
            "Cavalier King Charles Spaniel",
            "Chihuahua",
            "Chow Chow",
            "Cocker Spaniel",
            "Collie",
            "Dachshund",
            "Dalmatian",
            "Dobermann",
            "English Setter",
            "English Springer Spaniel",
            "Fox Terrier",
            "Foxhound",
            "French Bulldog",
            "German Shepherd",
            "Golden Retriever",
            "Great Dane",
            "Greyhound",
            "Irish Setter",
            "Irish Terrier",
            "Jack Russell",
            "Japanese Spitz",
            "King Charles Spaniel",
            "Labrador",
            "Lhasa Apso",
            "Maltese",
            "Mastiff",
            "Miniature Pinscher",
            "Newfoundland",
            "Old English Sheep",
            "Papillon",
            "Pekingese",
            "Pointer",
            "Pomeranian",
            "Poodle",
            "Portuguese Water Dog",
            "Pug",
            "Rottweiler",
            "Saint Bernard",
            "Schnauzer",
            "Scottish Terrier",
            "Shar-Pei",
            "Shetland Sheep",
            "Shih Tzu",
            "Siberian Husky",
            "Staffordshire Bull Terrier",
            "Weimaraner",
            "Welsh Corgi",
            "Yorkshire Terrier",
            "Other",
            "Unknown",
        ],
        default: "Unknown",
    },
    size: {
        type: String,
        enum: ["tiny", "small", "medium", "large", "extra-large"],
    }
})


const Dog = Pet.discriminator("Dog", dogSchema);

module.exports = Dog;
