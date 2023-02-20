const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
    }

const authenticatedUser = (username,password)=>{ 
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
    }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 360});
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
   const isbn = req.params.isbn;
   const review = req.body.review;
   const username = req.session.authorization.username;
   
   if (!books[isbn]) {
    return res.status(404).json({ message: 'Book is not found' });
  }
   if (!review) {
     return res.status(404).json({ message: 'No review in body' });
   }

   let reviews = books[isbn].reviews;
    reviews+req.body.review;
   res.status(200).json({ message: 'New review successfully added' });
 });

regd_users.delete("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book is not found' });
  }

  let reviews = books[isbn].reviews;

  if (reviews) {
    delete reviews;;
    res.status(200).json({ message: 'Your review has been deleted' });
  } else {
    res.status(404).json({ message: 'No reviews found' });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
