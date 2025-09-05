import app from "./config/express.js";
import connectDB from "./config/mongoose.js";
import * as environments from "./config/environments.js";
const start = async () => {
  connectDB()
    .then(app.listen(environments.PORT || 3000))
    .catch((error) => console.log("Unable to start node server.", error));
};

start();

export default app;
