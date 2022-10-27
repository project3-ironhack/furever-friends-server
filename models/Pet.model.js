const {Schema, model, default: mongoose} = require("mongoose");

const petSchema = new Schema (
    {
        petName: {
            type: String,
            required: true,
        },
        birthday: {
            type: Date,
        },
        ageType: {
            type: [String],
            enum: ["young", "adult", "senior"],
            required: true,
        },
        weight: {
            type: Number,
            min: 0,
            max: 100,
        },
        description: {
            type: String,
            required: true,
        },
        petFriendly: {
            type: [String],
            enum: ["no other pets", "good with dogs", "good with cats", "good with other", "unknown"],
            default: "unknown",
        },
        kidFriendly: {
            type: [String],
            enum: ["good with kids", "not good with kids", "unknown"],
            default: "unknown",
        },
        furLength: {
            type: [String],
            enum: ["furless", "short", "medium", "long"],
            default: "short",
        },
        location: {
            type: String,
            required: true,
        },
        isNeutered: {
            type: Boolean,
            default: false,
        },
        isVaccinated: {
            type: Boolean,
            default: false,
        },
        image: {
            type: String,
        },
        adoptionWith: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Association",
        }
    }
)

const Pet = model("Pet", petSchema);

module.exports = Pet;