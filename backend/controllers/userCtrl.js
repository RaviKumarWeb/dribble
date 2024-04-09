import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import fs from "fs";
import util from "util";
import dotenv from "dotenv";

dotenv.config();

const writeFile = util.promisify(fs.writeFile);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const signup = async (req, res) => {
  try {
    const { username, email, name, password } = req.body;

    // Check if email already exists
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Check if username already exists
    const existingUsername = await UserModel.findOne({ username });
    if (existingUsername) {
      return res
        .status(400)
        .json({ error: "Username is already used, Try another" });
    }

    const verificationToken = crypto.randomBytes(20).toString("hex");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserModel({
      username,
      email,
      name,
      password: hashedPassword,
      verificationToken: verificationToken,
    });
    await newUser.save();

    // Nodemailer configuration
    const config = {
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    };
    const transporter = nodemailer.createTransport(config);

    let message = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Thank you message.",
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
    <div style="text-align: center;">
        <img src="https://yourwebsite.com/logo.png" alt="Your Logo" style="max-width: 200px; margin-bottom: 20px;">
    </div>
    <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333333; font-size: 24px; font-weight: bold; margin-bottom: 20px;">Thank You for Registering!</h2>
        <p style="color: #666666; font-size: 16px; line-height: 1.6;">Hello there!</p>
        <p style="color: #666666; font-size: 16px; line-height: 1.6;">Thank you for registering with us. Your account has been created successfully.</p>
        <p style="color: #666666; font-size: 16px; line-height: 1.6;">If you have any questions or need assistance, please feel free to contact us.</p>
    </div>
    <div style="text-align: center; margin-top: 30px;">
        <p style="color: #999999; font-size: 14px;">© 2024 Your Company. All rights reserved.</p>
    </div>
</div>`,
    };

    transporter
      .sendMail(message)
      .then(() => {
        res.status(200).json({
          message: "You should receive an email.",
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Failed to send email" });
      });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
        verificationToken: existingUser.verificationToken,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ user: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const createProfile = async (req, res) => {
  try {
    const { location, profileBackgroundColor } = req.body;

    if (!req.files || !req.files.avatar) {
      return res.status(400).json({ message: "Please choose an image." });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // If the user has an existing avatar, delete it from Cloudinary
    if (user.avatar) {
      await cloudinary.uploader.destroy(user.avatar); // Delete the previous avatar from Cloudinary
    }

    const avatarFile = req.files.avatar;
    if (avatarFile.size > 500000) {
      return res.status(422).json({
        message: "Profile picture too big. Should be less than 500kb",
      });
    }
    const tempFilePath = `uploads/${Date.now()}-${avatarFile.name}`;

    // Move the uploaded file to the temporary file path
    await avatarFile.mv(tempFilePath);
    const result = await cloudinary.uploader.upload(tempFilePath);
    fs.unlinkSync(tempFilePath);

    user.avatar = result.secure_url;
    user.profileBackgroundColor = profileBackgroundColor;
    user.location = location;
    await user.save();

    res.status(200).json({ user, message: "Profile created successfully." });
  } catch (error) {
    console.log(error);
  }
};

export const addProfileOptions = async (req, res) => {
  const { profileOptions } = req.body;

  try {
    // Find the user by userId
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's profileOptions
    user.profileOptions = profileOptions;

    // Save the updated user
    await user.save();

    return res
      .status(200)
      .json({ user, message: "Profile options updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    // Handle errors
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.user;

    // Find user with the provided email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new verification token
    const verificationToken = user.verificationToken;
    if (!verificationToken) {
      return res
        .status(400)
        .json({ message: "No verification token found for this user" });
    }

    // Nodemailer configuration
    const config = {
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    };
    const transporter = nodemailer.createTransport(config);

    let message = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Email Verification",
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
    <div style="text-align: center;">
        <img src="https://yourwebsite.com/logo.png" alt="Your Logo" style="max-width: 200px; margin-bottom: 20px;">
    </div>
    <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333333; font-size: 24px; font-weight: bold; margin-bottom: 20px;">Thank You for Registering!</h2>
        <p style="color: #666666; font-size: 16px; line-height: 1.6;">Hello there!</p>
        <p style="color: #666666; font-size: 16px; line-height: 1.6;">Thank you for registering with us. Your account has been created successfully.</p>
        <p style="color: #666666; font-size: 16px; line-height: 1.6;">If you have any questions or need assistance, please feel free to contact us.</p>
    </div>
    <div style="text-align: center; margin-top: 30px;">
        <p style="color: #999999; font-size: 14px;">© 2024 Your Company. All rights reserved.</p>
    </div>
</div>
`,
    };

    transporter
      .sendMail(message)
      .then(() => {
        res
          .status(200)
          .json({ message: "Verification email resent successfully" });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Failed to resend verification email" });
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
