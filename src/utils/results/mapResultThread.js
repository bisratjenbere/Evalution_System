import { Worker, isMainThread, parentPort } from "worker_threads";
import { calculateRole } from "./workerScript.js";
import { roleMappings } from "./roleMappings.js";
import path from "path";

const mapResult = async (req) => {
  const employeeRole = req.user.role;
  const rolesToCalculate = roleMappings[employeeRole] || roleMappings.other;

  const promises = rolesToCalculate.map((role) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker("./src/utils/results/workerScript.js");
      worker.on("message", resolve);
      worker.on("error", reject);
      worker.on("exit", (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
      worker.postMessage({ userId: req.user._id, role });
    });
  });

  try {
    const results = await Promise.all(promises);

    return results;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default mapResult;
