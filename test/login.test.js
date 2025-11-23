const request = require('supertest');
const express = require ("express");
const userRoutes = require ( "../routes/userRoutes.js" );
const User = require ("../models/user");
const bcrypt = require("../utils/bcrypt");
const jwt = require("../utils/jwt");

describe("Vigtige login ting", () => {
    describe("bcrypt.hashPassword", () => {
        it("should hash a password", async () => {
            const password = "testtest1234";
            const hashed = await bcrypt.hashPassword(password);

            expect(hashed).toBeDefined();
            expect(hashed).not.toBe(password);
            expect(hashed.length).toBeGreaterThan(0);
        });
        it("should create different hashes for same password", async() => {
            const password = "testtest1234";
            const hash1 = await bcrypt.hashPassword(password);
            const hash2 = await bcrypt.hashPassword(password);

            expect(hash1).not.toBe(hash2);
        });
    });

    describe("bcrypt.comparePassword", () => {
        it("should return true for correct password", async() =>{
            const password = "testtest1234";
            const hashed = await bcrypt.hashPassword(password);

            const isMatch = await bcrypt.comparePassword(password, hashed);

            expect(isMatch).toBe(true);
        });

        it("false", async() =>{
            const password = "correct";
            const hashed = await bcrypt.hashPassword(password);

            const isMatch = await bcrypt.comparePassword("abhsudsagdgah", hashed);

            expect(isMatch).toBe(false);
        });
    });

    describe("jwt.generateToken", () => {
        it("should generate a valid token", () => {
            const userId = "test";
            const token = jwt.generateToken(userId);

            expect(token).toBeDefined();
            expect(typeof token).toBe("string");
            expect(token.split(".").length).toBe(3);
        });
    });

    describe("jwt.verifyToken", () => {
        it("should verify a valid token", async() =>{
            const userId = "test";
            const token = jwt.generateToken(userId);

            const decode = jwt.verifyToken(token);

            expect(decode).toBeDefined();
            expect(decode.userId).toBe(userId);
        });

        it("error due to fake token", () => {
            const fakeToken = "fakeity.mc.fake"

            expect(() => {
                jwt.verifyToken(fakeToken);
            }).toThrow();
        });
    });




})