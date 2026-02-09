import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

// Mock Modules using unstable_mockModule for ESM support
jest.unstable_mockModule('../lib/cloudinary.js', () => ({
    default: {
        uploader: {
            upload: jest.fn().mockResolvedValue({ secure_url: 'http://test-url.com/image.png' })
        }
    }
}));

jest.unstable_mockModule('../lib/socket.js', () => ({
    getReceiverSocketId: jest.fn(),
    io: { to: jest.fn().mockReturnThis(), emit: jest.fn() }
}));

// Dynamic imports must happen AFTER mocks are defined
const authRoutes = (await import('../routes/auth.route.js')).default;
const User = (await import('../models/user.model.js')).default;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);

let mongoServer;

beforeAll(async () => {
    process.env.JWT_SECRET = 'test_secret';
    process.env.NODE_ENV = 'test';

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await User.deleteMany({});
});

describe('Auth Endpoints', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/signup', () => {
        it('should create a new user with valid data', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    fullName: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.email).toBe('test@example.com');

            const user = await User.findOne({ email: 'test@example.com' });
            expect(user).toBeTruthy();
        });

        it('should return 400 if fields are missing', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    email: 'test@example.com'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toMatch(/fields are required/);
        });

        it('should return 400 for invalid email', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    fullName: 'Test User',
                    email: 'invalid-email',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Invalid email format');
        });

        it('should return 400 for short password', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    fullName: 'Test User',
                    email: 'test@example.com',
                    password: '123'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Password must be at least 6 characters');
        });

        it('should return 400 if email already exists', async () => {
            await User.create({
                fullName: 'Existing User',
                email: 'test@example.com',
                password: 'password123'
            });

            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    fullName: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Email already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            await request(app)
                .post('/api/auth/signup')
                .send({
                    fullName: 'Login User',
                    email: 'login@example.com',
                    password: 'password123'
                });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.email).toBe('login@example.com');
            const cookies = res.headers['set-cookie'];
            expect(cookies).toBeDefined();
            expect(cookies[0]).toMatch(/jwt/);
        });

        it('should fail with invalid password', async () => {
            await request(app)
                .post('/api/auth/signup')
                .send({
                    fullName: 'Login User',
                    email: 'login@example.com',
                    password: 'password123'
                });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Invalid credentials');
        });
    });
});
