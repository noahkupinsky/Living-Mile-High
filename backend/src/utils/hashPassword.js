const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log(`Hashed password: ${hashedPassword}`);
    } catch (error) {
        console.error('Error hashing password:', error);
    }
};

// Get the password from the command line arguments
const password = process.argv[2];

if (!password) {
    console.error('Please provide a password to hash.');
    process.exit(1);
}
bcrypt.compare("hello", "$2b$10/5WgnK5ser2GHvjZkFkFao42g8zWSHYhnro9epqm").then(console.log);
bcrypt.compare("hello", "$2b$10$qiZ2q01VawILx/5WgnK5ser2GHvjZkFkFao42g8zWSHYhnro9epqm").then(console.log);
hashPassword(password);