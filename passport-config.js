//Passport Konfiguration, siehe Youtubevideo. (server.js Zeile 1)
const { authenticate } = require("passport")
const bcrypt = require("bcrypt")

const LocalStrategy=require("passport-local").Strategy

 async function initialize(passport, getUserByName,getUserByID){
    const authenticateUser = async (name,password,done) =>{
        const user = await getUserByName(name)
        if(name== null){
            return done(null, false, {message: "No user with that name"})
        }
        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null,user)
            }else{
                return done(null,false,{message: "Password incorrect"})
            }
        }catch(e){
            if(e instanceof TypeError){
                done(null,false,{message:"Unknown User, please register"})
            }else{
            return done(e)
            }
        }
    }
    passport.use(new LocalStrategy({usernameField: "name"},authenticateUser))
    passport.serializeUser(( user, done)=>done(null,user.id))
    passport.deserializeUser((ID, done)=>{ 
        return done(null,async()=>{await getUserByID(ID)})
    })

}

module.exports =initialize