const helper = require('../helpers/api-response');
const { body, query, validationResult, header } = require('express-validator');
const commonFunction = require('../helpers/common-function');
const { validationMessage } = require('../helpers/constant');
const USER = require('../models/user-model');


exports.userRegistration = [
    body('first_name').trim().isString().notEmpty().withMessage(validationMessage.FIRST_NAME_REQUIRED),
    body('last_name').trim().isString().notEmpty().withMessage(validationMessage.LAST_NAME_REQUIRED),
    body('email').trim().isString().notEmpty().withMessage(validationMessage.EMAIL_REQUIRED)
        .isEmail().withMessage(validationMessage.INVALID_EMAIL),
    body('password').trim().isString().notEmpty().withMessage(validationMessage.PASSWORD_REQUIRED),
    commonFunction.validateRequest,     //middleware to validate input request
    async (req, res) => {
        try {
            const { first_name, last_name, password } = req.body;
            const email = req.body?.email.toLowerCase();

            const checkEmailExist = await USER.findOne({ email });
            if (checkEmailExist) {
                return helper.errorResponse(res, validationMessage.EMAIL_ALREADY_EXIST);
            }
            
            const payload = {
                first_name,
                last_name,
                email,
                password: await commonFunction.hashPassword(password)
            }

            const createUser = await USER.create(payload);

            const token = await commonFunction.generateToken(createUser._id);

            return helper.successResponseWithData(res, validationMessage.REGISTRATION_SUCCEESS, { userData: createUser, token: token });
        }
        catch (err) {
            console.log('catch block error ===>>>>', err);
            return helper.catchedErrorResponse(res, validationMessage.INTERNAL_SERVER_ERROR, err.message);
        }
    }
];


exports.userLogin = [
    body('email').trim().isString().notEmpty().withMessage(validationMessage.EMAIL_REQUIRED)
        .isEmail().withMessage(validationMessage.INVALID_EMAIL),
    body('password').trim().isString().notEmpty().withMessage(validationMessage.PASSWORD_REQUIRED),
    commonFunction.validateRequest,     //middleware to validate input request
    async (req, res) => {
        try {
            const { password } = req.body;
            const email = req.body?.email.toLowerCase();

            const checkEmailExist = await USER.findOne({ email });
            if (!checkEmailExist) {
                return helper.errorResponse(res, validationMessage.EMAIL_NOT_EXIST);
            }

            const verifyPassword = await commonFunction.comparePassword(password, checkEmailExist.password);
            if (!verifyPassword) {
                return helper.errorResponse(res, validationMessage.INCORRECT_PASSWORD);
            }

            const token = await commonFunction.generateToken(checkEmailExist._id);

            return helper.successResponseWithData(res, validationMessage.REGISTRATION_SUCCEESS, { userData: checkEmailExist, token: token });
        }
        catch (err) {
            console.log('catch block error ===>>>>', err);
            return helper.catchedErrorResponse(res, validationMessage.INTERNAL_SERVER_ERROR, err.message);
        }
    }
];



