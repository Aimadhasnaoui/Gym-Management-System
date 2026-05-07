import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
    FullName: {
        type: String,
        required: [true, 'Veuillez entrer le nom complet']
    },
    Email: {
        type: String,
        required: [true, 'Veuillez entrer l\'email'],
        unique: [true, "Cet email existe déjà"]
    },
    password : {
        type : String,
        required : [true,'Veuillez entrer le mot de passe']
    },
    role : {
        type : String,
        required : true,
        enum : ["admin","user"],
        default : "user"
    },

},{
    timestamps : true
})
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

export default mongoose.model("User", userSchema);