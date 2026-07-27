import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    FullName: {
      type: String,
      required: [true, "Veuillez entrer le nom complet"],
    },
    Email: {
      type: String,
      required: [true, "Veuillez entrer l'email"],
      unique: [true, "Cet email existe déjà"],
    },
    // Optional: member accounts are created without a password and set it
    // themselves via the one-time activation link.
    password: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "member"],
      default: "member",
    },
    // Account is usable only once activated. Accounts created with a password
    // (admins) are active immediately; members activate via email link.
    isActivated: {
      type: Boolean,
      default: true,
    },
    // Stores only the SHA-256 hash of the activation token, never the token.
    activationTokenHash: {
      type: String,
      select: false,
    },
    activationTokenExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);
userSchema.pre("save", async function () {
  // Guard: only hash when the password actually changed, so we never
  // double-hash an existing hash on unrelated saves.
  if (!this.isModified("password") || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (password) {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
