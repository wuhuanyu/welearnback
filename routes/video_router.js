"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const applyErrorMW = require('../utils/async_middleware');
const router = express.Router();
const fs = require("fs-extra");
const getError = require('../utils/error');
const models = require('../models/models');
const file_path = __dirname + '/../public/videos/video1.mp4';
router.get(/^\/([0-9]+)$/, applyErrorMW((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let course_id = req.url_params['course_id'];
    const stat = yield fs.stat(file_path);
    const fileSize = stat.size;
    const range = req.header.range;
    if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunck_size = end - start + 1;
        const file = fs.createReadStream(file_path, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accepte-Ranges': 'bytes',
            'Content-Length': chunck_size,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    }
    else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(file_path).pipe(res);
    }
})));
router.get(/^\/list$/, applyErrorMW((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let course_id = req.url_params['course_id'];
    let videos = yield models.Video.findAll({ where: { course_id: course_id } });
    if (videos.length === 0)
        throw getError(404, "Resoure not found");
    else {
        res.json({
            count: videos.length,
            data: videos,
        });
    }
})));
module.exports = router;
