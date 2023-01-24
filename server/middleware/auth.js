// here we will verify if a user has permission to like, post or delete a post

import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
  try {
    console.log(req.headers);
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token.includes("apps.googleusercontent.com")) {
      req.userId = token;
    }
    else if (token && isCustomAuth) {
      decodedData = jwt.verify(token, 'test');
      req.userId = decodedData?.id;
    }
    /*
    else {
      // for google verification token
      //decodedData = jwt.decode(token);
      //req.userId = decodedData?.sub;
      req.userId = token;
    }
    */
    next();  // this passes all the instances onto the next func call in a row in routes/posts.js
  } catch (err) {
    console.log(err);
  }
} 

export default auth;