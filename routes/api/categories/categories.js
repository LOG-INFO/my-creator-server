
var express = require('express');
var router = express.Router();

const upload = require('../../../config/multer');
const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage');
const encrypt = require('../../../module/utils/encrypt');
const db = require('../../../module/utils/pool');
const moment = require('moment');
const authUtil = require('../../../module/utils/authUtils');
const jwtUtil = require('../../../module/utils/jwt');

var urlencode = require('urlencode');
var querystring = require('querystring');
var url = require('url');


// 카테고리 조회
router.get('/', async (req, res) => {
    const getCategoriesQuery = "SELECT * FROM category";
    const getCategoriesResult = await db.queryParam_Parse(getCategoriesQuery);

    if (!getCategoriesResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.CATEGORY_SELECT_ERROR));
    } else {
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.CATEGORY_SELECT_SUCCESS, getCategoriesResult));
    }
});


//카테고리 생성
router.post('/', authUtil.isAdmin, async (req, res) => {
    const name = req.body;
    if (!name) {
        res.status(200).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.OUT_OF_VALUE));
    }
    const postCategoriesQuery = 'INSERT INTO category name VALUES ?';
    const postCategoriesResult = await db.queryParam_Parse(postCategoriesQuery, name);

    if (!postCategoriesResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.CATEGORY_INSERT_ERROR));
    } else {
        res.status(201).send(defaultRes.successTrue(statusCode.OK, resMessage.CATEGORY_INSERT_SUCCESS));
    };
});


// 카테고리 수정
router.put('/:categoryIdx', authUtil.isAdmin, (req, res) => {
    const { categoryIdx } = req.params;
    const name = req.body;

    // categoryIdx 없으면 에러 응답
    if (!categoryIdx || !name) {
        res.status(200).send(defaultRes.successFalse(statusCode.BAD_REQUEST, resMessage.OUT_OF_VALUE));
    }
    const putCategoriesQuery = `UPDATE category SET name = ${name} WHERE idx = ${categoryIdx}`;
    db.queryParam_Parse(putCategoriesQuery, function (result) {
        if (!result) {
            res.status(200).send(defaultRes.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.CATEGORY_UPDATE_ERROR));
        } else {
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.CATEGORY_UPDATE_SUCCESS));
        }
    });
});


//카테고리 삭제
router.delete('/:categoryIdx', authUtil.isAdmin, async (req, res) => {
    const { categoryIdx } = req.params;

    const deleteCategoriesQuery = "DELETE FROM category WHERE idx = ?";
    const deleteCategoriesResult = await db.queryParam_Parse(deleteCategoriesQuery, [categoryIdx]);

    if (!deleteCategoriesResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.CATEGORY_DELETE_ERROR));
    } else {
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.CATEGORY_DELETE_SUCCESS));
    }
});


module.exports = router;