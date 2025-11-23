const userService = require("../service/userService");
const User = require("../models/user");

describe("UserService - Login", () => {
    it("should successfully login with correct credentials", async () => {
        // Create test user
        const userData = {
            name: "Test User",
            email: "test@test.com",
            password: "password123"
        };
        await userService.createUser(userData);

        // Try to login
        const result = await userService.loginUser(userData.email, userData.password);

        expect(result).toBeDefined();
        expect(result.user).toBeDefined();
        expect(result.token).toBeDefined();
        expect(result.user.email).toBe(userData.email);
        expect(result.user.password).toBeUndefined(); // Password should not be in response
    });

    it("should throw error for non-existent email", async () => {
        await expect(
            userService.loginUser("nonexistent@test.com", "password123")
        ).rejects.toThrow("Invalid email or password");
    });

    it("should throw error for incorrect password", async () => {
        const userData = {
            name: "Test User",
            email: "test@test.com",
            password: "correctpassword"
        };
        await userService.createUser(userData);

        await expect(
            userService.loginUser(userData.email, "wrongpassword")
        ).rejects.toThrow("Invalid email or password");
    });
});
