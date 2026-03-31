const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");
const {
  connectTestDB,
  disconnectTestDB,
  clearDatabase,
} = require("../config/testDb");

describe("Autenticación", () => {
  // Conectar a DB de tests antes de todos los tests
  beforeAll(async () => {
    await connectTestDB();
  });

  // Limpiar la colección de usuarios antes de cada test
  beforeEach(async () => {
    await clearDatabase();
  });

  // Desconectar después de todos los tests
  afterAll(async () => {
    await disconnectTestDB();
  });

  describe("POST /api/auth/register", () => {
    it("debería registrar un usuario nuevo correctamente", async () => {
      const userData = {
        name: "Usuario Test",
        email: "test@ejemplo.com",
        password: "123456",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toHaveProperty("name", userData.name);
      expect(response.body.user).toHaveProperty("email", userData.email);
      expect(response.body.user).not.toHaveProperty("password");
    });

    it("debería fallar si el email ya existe", async () => {
      const userData = {
        name: "Usuario Test",
        email: "test@ejemplo.com",
        password: "123456",
      };

      await request(app).post("/api/auth/register").send(userData);

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("email ya está registrado");
    });

    it("debería fallar si faltan campos obligatorios", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({ name: "Solo nombre" })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send({
        name: "Usuario Test",
        email: "test@ejemplo.com",
        password: "123456",
      });
    });

    it("debería loguear usuario con credenciales correctas", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@ejemplo.com",
          password: "123456",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toHaveProperty("email", "test@ejemplo.com");
    });

    it("debería fallar con contraseña incorrecta", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@ejemplo.com",
          password: "password-incorrecta",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Credenciales inválidas");
    });
  });
});
