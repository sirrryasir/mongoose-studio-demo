const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { spawn } = require('child_process');
const User = require('./models/User');
const Post = require('./models/Post');
const path = require('path');

async function run() {
    // 1. Start In-Memory DB
    const mongod = await MongoMemoryServer.create({
        instance: {
            port: 27017 // Try to bind to default port if free, else random
        }
    });
    const uri = mongod.getUri();
    console.log(`InMemory DB started at: ${uri}`);

    // 2. Connect and Seed
    await mongoose.connect(uri);

    const user1 = await User.create({
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
    });

    const user2 = await User.create({
        name: 'Bob Smith',
        email: 'bob@example.com',
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
    });

    await Post.create([
        {
            title: 'Welcome to Mongoose Studio',
            content: 'Visualize your data with ease.',
            author: user1._id,
            tags: ['intro', 'demo'],
            published: true
        },
        {
            title: 'Hidden Draft',
            content: 'This post is not published yet.',
            author: user1._id,
            tags: ['secret'],
            published: false
        },
        {
            title: 'Community Feedback',
            content: 'Loving the dark mode UI!',
            author: user2._id,
            tags: ['feedback'],
            published: true
        }
    ]);

    console.log('Database seeded.');
    console.log('Database seeded.');
    // Keep connection open and process running
    console.log('\n---------------------------------------------------------');
    console.log('🎉 Demo Server Ready!');
    console.log(`📡 MongoDB is running at: ${uri}`);
    console.log('\n👉 Open a new terminal and run:');
    console.log(`   npx mongoose-studio --uri="${uri}" --models=models`);
    console.log('---------------------------------------------------------\n');

    // Keep the process alive by setting an interval or similar
    setInterval(() => { }, 1000 * 60 * 60);

    const cleanup = async () => {
        console.log('\nStopping database...');
        await mongoose.disconnect();
        await mongod.stop();
        process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
}

run().catch(err => console.error(err));
