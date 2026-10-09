import jwt from "jsonwebtoken";

export default function authenticate(request, response, next) {
  const authorization = request.get("Authorization") || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    response.status(401).json({ message: "Autenticação necessária." });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof payload !== "object" || typeof payload.sub !== "string") {
      response.status(401).json({ message: "Token inválido ou expirado." });
      return;
    }
    request.userId = payload.sub;
    next();
  } catch {
    response.status(401).json({ message: "Token inválido ou expirado." });
  }
}
