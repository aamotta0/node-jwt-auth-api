const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token;

  // Verificar si el token viene en el header Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Si no hay token, rechazar
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No autorizado. Token no proporcionado",
    });
  }

  try {
    // Verificar token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjuntar la información del usuario a la request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token inválido",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expirado",
      });
    }

    res.status(401).json({
      success: false,
      message: "No autorizado",
    });
  }
};

// Middleware opcional para verificar roles (para admin)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Rol ${req.user.role} no autorizado para esta acción`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };

/**
 * REGISTRO:
POST /api/auth/register
    ↓
authController.register()
    ↓
User.create({ name, email, password })
    ↓
Middleware pre('save') → encripta contraseña
    ↓
Se guarda en MongoDB
    ↓
generateToken() → crea JWT
    ↓
Respuesta con token y datos del usuario

LOGIN:
POST /api/auth/login
    ↓
authController.login()
    ↓
User.findOne({ email }).select('+password')
    ↓
comparePassword() → bcrypt.compare()
    ↓
generateToken() → crea JWT
    ↓
Respuesta con token

RUTA PROTEGIDA:
GET /api/auth/profile
Header: Authorization: Bearer <token>
    ↓
middleware protect() → jwt.verify()
    ↓
req.user queda con los datos del usuario
    ↓
getProfile() → responde con el perfil
 */
