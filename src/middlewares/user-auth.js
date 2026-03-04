const JWT = require('jsonwebtoken');
const helper = require('../helpers/api-response');
const USER = require('../models/user-model');
const { validationMessage } = require('../helpers/constant');


const validateUser = async (req, res, next) => {
    try {

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return helper.errorResponse(res, validationMessage.NO_TOKEN_FOUND);

        const verifyToken = JWT.verify(token, process.env.JWT_SECRET_KEY);
        if (!verifyToken) return helper.errorResponse(res, validationMessage.UNAUTHORIZED_TOKEN);

        const userData = await USER.findOne({ _id: verifyToken.userId });
        if (!userData) return helper.unAuthorizedResponse(res, validationMessage.UNAUTHORIZED_TOKEN);

        req.currentUser = userData;
        next();
    }
    catch (err) {
        console.log('catched errorrrrrrrrrrrrr', err);
        return helper.catchedErrorResponse(res, validationMessage.INTERNAL_SERVER_ERROR, err.message);
    }
}


module.exports = { validateUser };