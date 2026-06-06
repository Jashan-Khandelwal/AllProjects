const path = require("node:path");
const { Pool } = require("pg");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const pool = require("./db/pool");
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.initialize()); // ✅ add this
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

passport.use(
    new LocalStrategy(async(username,password,done)=>{
        try{
            const{rows}=await pool.query
        }
    })
)