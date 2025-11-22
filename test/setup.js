const { connectDB, closeDB, clearDB } = require("./dbHelper");

beforeAll(async ()=> {
    await connectDB();
});

afterEach(async ()=> {
    await clearDB();
});

afterAll(async ()=> {
    await closeDB();
});

