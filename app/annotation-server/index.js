const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { jsonld } = require("./controllers/middleware");
const routes = require("./routes");

const app = express();
app.use(
  cors({
    credentials: true,
    origin: /.*/
  })
);
app.use(bodyParser.raw({ type: "*/*" }));
app.use(jsonld);

app.use(routes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
