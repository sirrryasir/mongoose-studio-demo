const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mongoose-studio-demo')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

async function seed() {
    await User.deleteMany({});
    await Post.deleteMany({});

    const user1 = await User.create({
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'admin',
        avatar: 'https://i.pravatar.cc/150?u=alice'
    });

    const user2 = await User.create({
        name: 'Bob Smith',
        email: 'bob@example.com',
        role: 'user',
        avatar: 'https://i.pravatar.cc/150?u=bob'
    });

    await Post.create([
        {
            title: 'Hello Mongoose Studio',
            content: 'This is a sample post to demonstrate the visualizer.',
            author: user1._id,
            tags: ['mongoose', 'gui', 'demo'],
            published: true
        },
        {
            title: 'Another Draft Post',
            content: 'Working on something exciting...',
            author: user1._id,
            tags: ['wip'],
            published: false
        },
        {
            title: 'Bob\'s Thoughts',
            content: 'Just checking out this cool tool.',
            author: user2._id,
            tags: ['random'],
            published: true
        }
    ]);

    console.log('Database seeded!');
    process.exit();
}

seed();
