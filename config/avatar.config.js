"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer = require("multer");
const path = require("path");
const avatarDest = path.resolve(__dirname + '../uploads/avatars');
const storage = multer.diskStorage({
    destination: (req, file, cbk) => {
        cbk(null, avatarDest);
    },
    filename: (req, file, cbk) => {
        cbk(null, new Date().getTime() + file.originalname);
    }
});
const upload = multer({ storage: storage });
exports.default = upload.single('avatar');
