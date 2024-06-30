import express from 'express';
import router from './routes';


const { BPORT } = process.env;

const app = express();

app.use(express.json());
app.use(router);

const server = app.listen(BPORT, () => {
    console.log(`Superadmin server listening on port ${BPORT}`);
});

