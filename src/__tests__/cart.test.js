const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Product = require("../models/Product");
const {
  connectTestDB,
  disconnectTestDB,
  clearDatabase,
} = require("../config/testDb");

describe("Carrito de Compras", () => {
  let token;
  let productId;

  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();

    // Crear un usuario y obtener token
    const userData = {
      name: "Test User",
      email: "cartuser@ejemplo.com",
      password: "123456",
    };

    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send(userData);

    token = registerResponse.body.token;

    // Crear un producto para probar
    const product = await Product.create({
      name: "Producto Test",
      price: 10000,
      stock: 10,
      description: "Producto para pruebas",
    });
    productId = product._id.toString();
  });

  describe("GET /api/cart", () => {
    it("debería obtener carrito vacío para usuario nuevo", async () => {
      const response = await request(app)
        .get("/api/cart")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toEqual([]);
      expect(response.body.data.total).toBe(0);
    });

    it("debería rechazar petición sin token", async () => {
      const response = await request(app).get("/api/cart").expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("No autorizado");
    });
  });

  describe("POST /api/cart/add", () => {
    it("debería agregar producto al carrito", async () => {
      const response = await request(app)
        .post("/api/cart/add")
        .set("Authorization", `Bearer ${token}`)
        .send({
          productId,
          quantity: 2,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.total).toBe(20000);
    });

    it("debería fallar con producto inexistente", async () => {
      const fakeId = "60f7b3b3b3b3b3b3b3b3b3b3";
      const response = await request(app)
        .post("/api/cart/add")
        .set("Authorization", `Bearer ${token}`)
        .send({
          productId: fakeId,
          quantity: 1,
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Producto no encontrado");
    });
  });
});
