import jwt from "jsonwebtoken";

// Short-lived signed token used as the OAuth "state" param, so the callback
// (a plain browser redirect, no Authorization header) can know which user
// and platform initiated the connection, plus a PKCE verifier when needed.
export const createState = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10m" });

export const verifyState = (state) => jwt.verify(state, process.env.JWT_SECRET);
