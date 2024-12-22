// backend/src/routes/recordRoutes.ts
import express, { Request, Response } from "express";
import {
    getLatestRecord,
    getAllRecords,
    getStatus,
    getAllCounts,
    saveRecord,
    deleteRecord
} from "../controllers/recordController";


const router = express.Router();

// /api/record/all に対応
router.get("/record/all", (req, res, next) => {
    console.log("Processing GET /record/all");
    next(); 
}, getAllRecords);

router.get("/record/latest", (req, res, next) => {
    console.log("Processing GET /record/latest");
    next(); 
}, getLatestRecord);

router.get("/record/status", (req, res, next) => {
    console.log("Processing GET /record/status");
    next(); 
}, getStatus);

router.get("/record/count", (req, res, next) => {
    console.log("Processing GET /record/count");
    next(); 
}, getAllCounts);

router.post("/save", (req, res, next) => {
    console.log("Processing GET /save");
    next(); 
}, saveRecord);

router.delete("/record/:id", (req, res, next) => {
    console.log("Processing GET /delete");
    next(); 
}, deleteRecord);


router.use((req, res, next) => {
    console.log(`Record Route Accessed: ${req.method} ${req.originalUrl}`);
    next(); 
});


export default router;


