import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { isObject, validEmail } from "../middlewares/validate.js";

function createToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, {
    subject: userId.toString(),
    expiresIn: "7d",
  });
}

function publicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}

export async function register(request, response, next) {
  try {
    const { name, email, password } = request.body || {};
    if (!isObject(request.body) || typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
      response.status(400).json({ message: "Informe nome, e-mail e senha válidos." });
      return;
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedName.length < 2 || normalizedName.length > 80) {
      response.status(400).json({ message: "O nome deve ter entre 2 e 80 caracteres." });
      return;
    }
    if (!validEmail(normalizedEmail)) {
      response.status(400).json({ message: "Informe um e-mail válido." });
      return;
    }
    if (password.length < 8 || password.length > 128) {
      response.status(400).json({ message: "A senha deve ter entre 8 e 128 caracteres." });
      return;
    }

    const existingUser = await User.exists({ email: normalizedEmail });
    if (existingUser) {
      response.status(409).json({ message: "Este e-mail já está cadastrado." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: passwordHash,
    });
    response.status(201).json({
      token: createToken(user._id),
      user: publicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      response.status(409).json({ message: "Este e-mail já está cadastrado." });
      return;
    }
    next(error);
  }
}

export async function login(request, response, next) {
  try {
    const { email, password } = request.body || {};
    if (!isObject(request.body) || !validEmail(email) || typeof password !== "string" || password.length > 128) {
      response.status(400).json({ message: "Informe e-mail e senha válidos." });
      return;
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      response.status(401).json({ message: "E-mail ou senha incorretos." });
      return;
    }

    response.json({
      token: createToken(user._id),
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
}

export async function currentUser(request, response, next) {
  try {
    const user = await User.findById(request.userId);
    if (!user) {
      response.status(401).json({ message: "Usuário não encontrado." });
      return;
    }
    response.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}
