const {Schema} = require("mongoose")
const User = require("./User.model")

const associationSchema = new Schema({
    website: {
        type: String,
        required: [true, "website is required"],
    },
    associationType: {
        type: String,
        enum: ["rescue group", "shelter", "city pound"]
    },
    image: {
        type: String,
    },
})


const Association = User.discriminator("Association", associationSchema);

module.exports = Association;
