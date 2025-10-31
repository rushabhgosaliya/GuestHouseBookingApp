import express from "express";
import { user } from "../controller/userController.js"; 

const router = express.Router();

router.post("/adduser", user);

export default router;
