export const authconfig = {
  jwt:{
    secret: process.env.JWT_SECRET,
    expiresIn: "1d",
  }
}