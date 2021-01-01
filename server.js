const express = require('express');
require('dotenv').config(); // Get access to env variables
const jwt = require('express-jwt'); // Validate JWT and set req.user
const jwksRsa = require('jwks-rsa'); // Retrieve RSA keys fro a JSON Web Key set (JWKS) endpoint
const checkScope = require('express-jwt-authz'); // Validates JWT Scopes

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header
  // and the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true, // cache the signing key
    rateLimit: true,
    jwksRequestsPerMinute: 5, // prevent attackers from requesting more than 5 per minute
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,

  // This must match the algorithm selected in the Auth0 dashboard under your app's advanced settings under the OAuth tab
  algorithms: ['RS256'],
});

const app = express();

app.get('/public', (req, res) => {
  res.json({
    message: 'Hello from a public API!',
  });
});

// checkJwt middleware
app.get('/private', checkJwt, (req, res) => {
  res.json({
    message: 'Hello from a private API!',
  });
});

function checkRole(role) {
  return function (req, res, next) {
    const assignedRoles = req.user['http://localhost:3000/roles'];

    if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
      return next();
    } else {
      return res.status(401).send('Insufficient role');
    }
  };
}

// Imagine that this endpoint is hosted by Pluralsight to return an author courses
app.get('/courses', checkJwt, checkScope(['read:courses']), (req, res) => {
  res.json({
    // In the real world, it would read the subscriber ID from the access token,
    // and use it to query the database for the author's courses
    courses: [
      { id: 1, title: 'Building Apps with React and Redux' },
      { id: 2, title: 'Creating Reusable React Components' },
    ],
  });
});

// checkJwt middleware
app.get('/admin', checkJwt, checkRole('admin'), (req, res) => {
  res.json({
    message: 'Hello from an admin API!',
  });
});

app.listen(3001);
console.log(`API server listening on ${process.env.REACT_APP_AUTH0_AUDIENCE}`);
