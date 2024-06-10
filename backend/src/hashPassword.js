const bcrypt = require('bcrypt');
const password = 'masterpassword';

bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    console.log(hash); // Save this hash in your environment variable
});