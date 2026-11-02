import express from "express";
import routes from "./routes/index.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});
app.use(express.json());
app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

export default app;
