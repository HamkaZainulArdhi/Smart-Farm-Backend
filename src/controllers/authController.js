import { User } from '../models/index.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const register = async (req, res) => {
  try {
    const { nama, email, password, nomor_telepon, alamat, role } = req.validatedData;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse(res, 409, 'Email sudah terdaftar');
    }

    // Create new user
    const user = await User.create({
      nama,
      email,
      password,
      nomor_telepon,
      alamat,
      role: role || 'petani',
    });

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    const token = generateToken(user.id, user.role);

    successResponse(res, 201, 'Registrasi berhasil', {
      user: userResponse,
      token,
    });
  } catch (error) {
    errorResponse(res, 500, 'Error saat registrasi', error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.validatedData;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, 401, 'Email atau password salah');
    }

    // Check if user is active
    if (!user.aktif) {
      return errorResponse(res, 401, 'User tidak aktif');
    }

    // Compare password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return errorResponse(res, 401, 'Email atau password salah');
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    successResponse(res, 200, 'Login berhasil', {
      user: userResponse,
      token,
    });
  } catch (error) {
    errorResponse(res, 500, 'Error saat login', error.message);
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return errorResponse(res, 404, 'User tidak ditemukan');
    }

    successResponse(res, 200, 'Profile user berhasil diambil', user);
  } catch (error) {
    errorResponse(res, 500, 'Error mengambil profile', error.message);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { nama, nomor_telepon, alamat } = req.body;

    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return errorResponse(res, 404, 'User tidak ditemukan');
    }

    if (nama) user.nama = nama;
    if (nomor_telepon) user.nomor_telepon = nomor_telepon;
    if (alamat) user.alamat = alamat;

    await user.save();

    const userResponse = user.toJSON();
    delete userResponse.password;

    successResponse(res, 200, 'Profile berhasil diupdate', userResponse);
  } catch (error) {
    errorResponse(res, 500, 'Error mengupdate profile', error.message);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { password_lama, password_baru } = req.body;

    if (!password_lama || !password_baru) {
      return errorResponse(res, 400, 'Password lama dan baru harus diisi');
    }

    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return errorResponse(res, 404, 'User tidak ditemukan');
    }

    const isPasswordMatch = await user.comparePassword(password_lama);
    if (!isPasswordMatch) {
      return errorResponse(res, 401, 'Password lama tidak sesuai');
    }

    user.password = password_baru;
    await user.save();

    successResponse(res, 200, 'Password berhasil diubah');
  } catch (error) {
    errorResponse(res, 500, 'Error mengubah password', error.message);
  }
};

export const logout = async (req, res) => {
  try {
    successResponse(res, 200, 'Logout berhasil');
  } catch (error) {
    errorResponse(res, 500, 'Error saat logout', error.message);
  }
};
