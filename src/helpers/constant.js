exports.validationMessage = {
    FIRST_NAME_REQUIRED: 'First name is a required field.',
    LAST_NAME_REQUIRED: 'Last name is a required field.',
    EMAIL_REQUIRED: 'Email is a required field.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    PASSWORD_REQUIRED: 'Password is a required field.',
    AMOUNT_REQUIRED: 'Amount is a required field.',
    INVALID_AMOUNT: 'Please enter a valid amount greater than 0.',
    DESTINATION_REQUIRED: 'Destination is a required field.',
    IDEMPOTENCY_KEY_REQUIRED: 'Idempotency key is required.',
    INTERNAL_SERVER_ERROR: 'Internal server error.',
    DATA_SUCCEESS: 'Success.',
    LOGOUT_SUCCEESS: 'Logout success.',
    DATA_NOT_EXIST: 'Data does not exist.',
    DATA_UPDATE_SUCCESS: 'Data updated successfully.',
    DATA_DELETE_SUCCESS: 'Data deleted successfully.',
    EMAIL_ALREADY_EXIST: 'Email is already exist.',
    EMAIL_NOT_EXIST: 'Email does not exist.',
    REGISTRATION_SUCCEESS: 'Registration success...',
    INCORRECT_PASSWORD: 'Incorrect password.',
    FUNDS_ADDED_SUCCESS: 'Funds added successfully.',
    INSUFFICIENT_BALANCE: 'Insufficient wallet balance.',
    PAYMENT_SUCCESS: 'Payment completed successfully.',
    NO_TOKEN_FOUND: 'No token found for this User.',
    UNAUTHORIZED_TOKEN: 'Un-authorized User.',
}

exports.commonStatus = {
    SUCCESS: 'success',
    FAILED: 'failed',
    PENDING: 'pending',
    PROCESSING: 'processing'
}

exports.transactionType = {
    DEPOSIT: 'deposit',
    WITHDRAWAL: 'withdrawal',
    TRANSFER: 'transfer'
}
