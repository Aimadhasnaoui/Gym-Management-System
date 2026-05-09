import mongoose from "mongoose";

const membershema  = new mongoose.Schema({
    FullName: {
        type : String,
        required : [true,'Veuillez entrer le nom complet']
    },
    Email : {
        type : String,
        required : [true,'Veuillez entrer l\'email'],
        unique : [true,"Cet email existe déjà"]
    },
    phone : {
        type : String,
        required : [true,'Veuillez entrer le numéro de téléphone']
    },
    address : {
        type : String,
        required : [true,'Veuillez entrer l\'adresse']
    },
    Plan :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Plan",
        required : [true,'Veuillez sélectionner un plan']
    },
    startDate:{type:Date,required:[true,'Veuillez sélectionner une date de début'],default:Date.now},
    endDate:{type:Date},
    status:{
        type : String,
        required : true,
        enum : ["active","inactive","Expiring"],
        default : "active"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    }
}, {
    timestamps: true
})

export default mongoose.model("Member", membershema);