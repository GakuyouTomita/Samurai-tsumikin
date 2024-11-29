// backend/src/routes/index.ts
import express from "express";
import recordRoutes from "./recordRoutes";

const router = express.Router();



router.use("/record", recordRoutes);

export default router;

