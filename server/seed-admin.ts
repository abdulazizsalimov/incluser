import { storage } from "./storage";
import bcrypt from "bcryptjs";

export async function seedAdmin() {
  try {
    // Проверяем, существует ли уже администратор
    const existingAdmin = await storage.getUserByUsername("Gomer98");
    
    if (existingAdmin) {
      console.log("✓ Администратор уже существует");
      return;
    }

    // Создаем администратора
    const hashedPassword = await bcrypt.hash("12345", 10);
    
    await storage.createUser({
      username: "Gomer98",
      email: "admin@incluser.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      isAdmin: true,
      profileImageUrl: null
    });

    console.log("✓ Администратор создан:");
    console.log("  Логин: Gomer98");
    console.log("  Пароль: 12345");
    console.log("  Email: admin@incluser.com");
  } catch (error) {
    console.error("Ошибка при создании администратора:", error);
  }
}