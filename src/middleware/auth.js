import { verifyToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/response.js';
import { User } from '../models/index.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Token tidak ditemukan atau format salah');
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return errorResponse(res, 401, 'Token tidak valid atau sudah kadaluarsa');
    }

    const user = await User.findByPk(decoded.userId);

    if (!user || !user.aktif) {
      return errorResponse(res, 401, 'User tidak ditemukan atau tidak aktif');
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      userData: user,
    };

    next();
  } catch (error) {
    errorResponse(res, 500, 'Error pada autentikasi', error.message);
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Tidak terautentikasi');
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return errorResponse(res, 403, 'Anda tidak memiliki izin untuk akses ini');
    }

    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      req.user = null;
      return next();
    }

    const user = await User.findByPk(decoded.userId);

    if (!user || !user.aktif) {
      req.user = null;
      return next();
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      userData: user,
    };

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};
