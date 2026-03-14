/**
 * Lambda handler — wraps the Express app for AWS Lambda + API Gateway.
 * Add `serverless-http` to backend dependencies before deploying.
 * 
 * In backend/src/index.js, export `app` and add this file as the Lambda handler.
 */
const serverless = require("serverless-http");
const app = require("./src/index");

module.exports.handler = serverless(app);
