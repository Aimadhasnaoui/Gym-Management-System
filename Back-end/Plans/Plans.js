import mongoose, { model } from "mongoose";
const PlanShema = new  mongoose.Schema({
    name : {
        type : String,
        required : [true,"Veuillez entrer le nom du plan"]
    },
    price : {
        type : Number,
        required : [true,"Veuillez entrer le prix du plan"]
    },
    duration : {
        type : Number,
        required : [true,"Veuillez entrer la durée du plan"]
    },

}, {
    timestamps: true
})

export default mongoose.model("Plan", PlanShema);
