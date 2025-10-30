import { createMocks } from "node-mocks-http";
import mongoose from "mongoose";
import Product from "../lib/models/Product.js";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;
let POST, GET;


beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  process.env.ADMIN_KEY = "test-secret";

  await mongoose.connect(uri, { dbName: "testdb" });

  //Lazy import API routes AFTER env vars are ready
  const routes = await import("../app/api/products/route.js");
  POST = routes.POST;
  GET = routes.GET;
}, 20000);

// Clean database after each test
afterEach(async () => {
  await Product.deleteMany();
});

// Disconnect after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("API /api/products", () => {
  
  test("GET should return 200 and empty array", async () => {
    const { req } = createMocks({
      method: "GET",
      url: "http://localhost:3000/api/products",
    });

    const response = await GET(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
  });

  
  test("POST should return 401 if admin key missing", async () => {
    const { req } = createMocks({
      method: "POST",
      url: "http://localhost:3000/api/products",
      body: {
        name: "Test Product",
        slug: "test-product",
        price: 100,
      },
      headers: {},
    });

    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  test("POST should return 400 if required fields are missing", async () => {
    const { req } = createMocks({
      method: "POST",
      url: "http://localhost:3000/api/products",
      headers: {
        "x-admin-key": "test-secret",
      },
      body: { name: "Test Product" }, // missing slug, price
    });

    const response = await POST(req);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toMatch(/Missing required fields/i);
  });

 
  test("POST should create a product successfully", async () => {
    const { req } = createMocks({
      method: "POST",
      url: "http://localhost:3000/api/products",
      headers: {
        "x-admin-key": "test-secret",
      },
      body: {
        name: "iPhone 16",
        slug: "iphone-16",
        price: 99999,
        category: "mobiles",
        inventory: 10,
        image: "https://example.com/iphone.jpg",
      },
    });

    const response = await POST(req);
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data.name).toBe("iPhone 16");

    const productInDb = await Product.findOne({ slug: "iphone-16" });
    expect(productInDb).not.toBeNull();
  });
});
