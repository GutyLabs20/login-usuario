import { sign, verify } from "jsonwebtoken";
import { JWT_SECRET, JWT_REFRESH, JWT_EXPIRATION_TIME, REFRESH_TOKEN_EXPIRATION_TIME, MODE_NODE } from '../config';
import { cookie } from "express-validator";


const generateAccessToken = (id: string) => {
  const jwt = sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION_TIME,
  });
  return jwt;
};

const generateRefreshToken = (id: string) => {
  // const expiresInNumber = 60 * 60 * 24 * 7;
  const expiresIn = REFRESH_TOKEN_EXPIRATION_TIME;
  const refreshjwt = sign({ id }, JWT_REFRESH, {
    expiresIn,
  });
  cookie("refreshToken", refreshjwt);

  return refreshjwt;
};

const verifyToken = (jwt: string) => {
  const isOk = verify(jwt, JWT_SECRET);
  return isOk;
};

const verifyRefreshToken = (refreshToken: string) => {
  const decodedToken = verify(refreshToken, JWT_REFRESH);
  return decodedToken;
}

export { generateAccessToken, verifyToken, generateRefreshToken, verifyRefreshToken };