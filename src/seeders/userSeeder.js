import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

const hashedPassword = await bcrypt.hash("password123", 10);
export const userSeeds = [
  {
    id: randomUUID(),
    nama: "Budi Santoso",
    email: "budi@petani.com",
    password: hashedPassword,
    nomor_telepon: "0812345679",
    alamat: "Bogor, Jawa Barat",
    role: "petani",
    aktif: true,
  },
  {
    id: randomUUID(),
    nama: "Siti Nurhaliza",
    email: "siti@petani.com",
    password: hashedPassword,
    nomor_telepon: "0812345680",
    alamat: "Bandung, Jawa Barat",
    role: "petani",
    aktif: true,
  },
  {
    id: randomUUID(),
    nama: "Dr. Ahmad Wijaya",
    email: "ahmad@penyuluh.com",
    password: hashedPassword,
    nomor_telepon: "0812345681",
    alamat: "Yogyakarta, Indonesia",
    role: "penyuluh",
    aktif: true,
  },
  {
    id: randomUUID(),
    nama: "Rina Setiawan",
    email: "rina@penyuluh.com",
    password: hashedPassword,
    nomor_telepon: "0812345682",
    alamat: "Surabaya, Jawa Timur",
    role: "penyuluh",
    aktif: true,
  },
];
