const {Schema} = require("mongoose")
const User = require("./User.model")

const adopterSchema = new Schema({
    home: {
        type: [String],
        enum: ["apartment", "house", "other"]
    },
    yardAccess: {
        type: Boolean,
        default: false,
    },
    hasKids: {
        type: Boolean,
        default: false,
    },
    hasPets: {
        type: [String],
        enum: ["no", "cat", "dog", "other"]
    }
})


const Adopter = User.discriminator("Adopter", adopterSchema)

module.exports = Adopter