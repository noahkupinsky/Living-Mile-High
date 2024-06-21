const bcrypt = require('bcryptjs');
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
hashPassword(password);