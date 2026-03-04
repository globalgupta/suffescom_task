# suffescom_task
This task is part of the interview process.

## Node.js + Express + MongoDB 

Base URL:
`http://localhost:8080/api/v1`

## API Flow 
1. Register user  
`POST /user-registration`

2. Login user and get JWT token  
`POST /user-login`

3. Add funds to wallet (auth required)  
`POST /payment/add-funds-to-wallet`

4. Make payment (auth + idempotency required)  
`POST /payment/make-payment`

## Auth Header

Use in protected APIs:
`Authorization: Bearer <JWT_TOKEN>`

## Idempotency Header (Make Payment)

Required for:
`POST /payment/make-payment`

Header:
`user-idempotency-key: <unique_key_per_payment_intent>`

If the same key is retried for the same user, API returns previous payment result instead of creating duplicate debit.

