import mongoose from "mongoose";
const checkInSchema = new mongoose.Schema({
    MemberId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Member",
        required : [true,"Veuillez sélectionner un membre"]
    },
    CheckIn : {
        type : Date,
        required : [true,"Veuillez sélectionner une date de check-in"],
        default : Date.now
    },
}, {
    timestamps: true
})

export default mongoose.model("CheckIn", checkInSchema);