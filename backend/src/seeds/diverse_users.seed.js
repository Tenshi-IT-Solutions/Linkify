import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';

config();

const users = [
    {
        name: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        gender: "men",
        avatarId: 10
    },
    {
        name: "Wei Chen",
        email: "wei.chen@example.com",
        gender: "men",
        avatarId: 11
    },
    {
        name: "Zara Al-Fayed",
        email: "zara.alfayed@example.com",
        gender: "women",
        avatarId: 12
    },
    {
        name: "Kwame Osei",
        email: "kwame.osei@example.com",
        gender: "men",
        avatarId: 13
    },
    {
        name: "Hiroshi Tanaka",
        email: "hiroshi.tanaka@example.com",
        gender: "men",
        avatarId: 14
    },
    {
        name: "Priya Patel",
        email: "priya.patel@example.com",
        gender: "women",
        avatarId: 15
    },
    {
        name: "Mateo Rodriguez",
        email: "mateo.rodriguez@example.com",
        gender: "men",
        avatarId: 16
    },
    {
        name: "Amara Ndiaye",
        email: "amara.ndiaye@example.com",
        gender: "women",
        avatarId: 17
    },
    {
        name: "Fatima Khan",
        email: "fatima.khan@example.com",
        gender: "women",
        avatarId: 18
    },
    {
        name: "Dmitry Ivanov",
        email: "dmitry.ivanov@example.com",
        gender: "men",
        avatarId: 19
    },
    {
        name: "Sofia Rossi",
        email: "sofia.rossi@example.com",
        gender: "women",
        avatarId: 20
    },
    {
        name: "Lebo Mokoena",
        email: "lebo.mokoena@example.com",
        gender: "women",
        avatarId: 21
    },
    {
        name: "Yuki Sato",
        email: "yuki.sato@example.com",
        gender: "women",
        avatarId: 22
    },
    {
        name: "Carlos Gomez",
        email: "carlos.gomez@example.com",
        gender: "men",
        avatarId: 23
    },
    {
        name: "Aisha Ahmed",
        email: "aisha.ahmed@example.com",
        gender: "women",
        avatarId: 24
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing users before seeding
        await User.deleteMany({});
        console.log("Existing users cleared");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        const seedUsers = users.map(user => ({
            fullName: user.name,
            email: user.email,
            password: hashedPassword,
            profilePic: `https://randomuser.me/api/portraits/${user.gender}/${user.avatarId}.jpg`
        }));

        await User.insertMany(seedUsers);
        console.log(`Database seeded successfully with ${seedUsers.length} diverse users`);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
