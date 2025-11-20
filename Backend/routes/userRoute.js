// import express from "express";
// import { user } from "../controller/userController.js"; 

// const router = express.Router();

// router.post("/adduser", user);

// export default router;

// import express from "express";
// import { updateUser } from "../controller/UpdateUser.js";
// // import { updateUser } from "../controller/updateuser.js";

// const router = express.Router();

// // ✅ Must match this exact path and method:
// router.put("/user/:id", updateUser);

// export default router;

import express from "express";
import { getAllUsers, addUser, updateUser, deleteUser } from "../controller/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", addUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
