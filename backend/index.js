const express = require("express");
const router = require("./routes/index");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/v1', router);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});