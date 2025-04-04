import validator from "validator";

import { checkEmailExists, checkUsernameExists } from "../helper/authHelper";
import { generateToken } from "../helper/tokenHelper";
import { getHash } from "../helper/util";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function authRegister(
  name: string,
  email: string,
  password: string,
  username: string,
  institution: string
) {
  // Error Handling
  if (name.length < 1) throw { status: 400, message: "Name cannot be empty." };
  if (!validator.isEmail(email))
    throw { status: 400, message: "Invalid email address." };
  if (await checkEmailExists(email))
    throw {
      status: 400,
      message: "Email address is already being used by another user.",
    };
  if (await checkUsernameExists(username))
    throw {
      status: 400,
      message: "Username is already being used by another user.",
    };

  // TODO: Create the user

  // TODO: Generate the token
  // const token = await generateToken(user.id);
}
