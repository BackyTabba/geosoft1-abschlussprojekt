const express = require('express')
const session = require('express-session') // session middleware for express
const bodyParser= require('body-parser')  // needed to work with req.body

const TWO_HOURS = 1000 * 60 * 60 * 2 // miliseconds * seconds * minutes * hours

const {
  PORT = 3000,
  SESS_NAME= 'sid',
  SESS_SECRET= 'secret',
  SESS_LIFETIME = TWO_HOURS
} = process.env

//TODO : this should be a database
const users= [
  {id: 1, name: 'Bob', email:'bobsemail', password:'secret' },
  {id: 2, name: 'Boob', email:'boobsemail', password:'secret' },
  {id: 3, name: 'Bobby', email:'bobbysemail', password:'secret' }
]

const app = express()

app.use(bodyParser.urlencoded({
  extended:true
}))

app.use(session({
  name: SESS_NAME,
  resave:false,
  saveUninitialized: false,
  secret: SESS_SECRET,
  cookie:{
    maxAge: SESS_LIFETIME,
    sameSite: true,  // browser will only accept the cookie if it comes from the same origin / domain
    secure: true
    }
}))

app.get('/', (req, res) =>{
  const userId = 1;
  console.log(req.session)
  console.log(req.sessionID)

  res.send(`
    <h1>Welcome</h1>
     ${userId ? `
      <a href='/home'>Home</a>
      <form method='post' action='/logout'>
        <button>Logout</button>
      </form>
      ` :`
      <a href='/login'>Login</a>
      <a href='/register'>Register</a>
      `}
    `)
} )

app.get('/home', (req, res) =>{  // protection from redirectLogin middleware
  const user = users.find(user => user.id === req.session.userId)
  console.log(req.session)
  console.log(req.sessionID)
  res.send(`
    <h1>Home</h1>
    <a href='/'>Main</a>
    <ul>
     <li>Name:  </li>
     <li>Email: </li>
    </ul>
  `)
} )

app.get('/login', (req, res) =>{
  res.send(`
    <h1>Login</h1>
    <form method='post' action='/login'>
     <input type='email' name='email' placeholder='Email' required />
     <input type='password' name='password' placeholder='Password' required />
     <input type='submit'/>
    </form>
    <a href='/register'>Register</a>
    `)
} )

app.get('/register', (req, res) =>{
  res.send(`
    <h1>Register</h1>
    <form method='post' action='/register'>
     <input name='name' placeholder='Name' required />
     <input type='email' name='email' placeholder='Email' required />
     <input type='password' name='password' placeholder='Password' required />
     <input type='submit'/>
    </form>
    <a href='/register'>Login</a>
    `)
} )

app.post('/login', (req, res) =>{
  return res.redirect('/login')   // Login succesful
})

app.post('/register', (req, res) =>{
  // const {name, email, password } = req.body
  //
  // if(name && email && password){  // TODO: maybe better validation, e.g. length of email / strength of password
  //   const exists = users.some(    // find out if there is a matching user already existing
  //     user => user.email === email
  //   )
  //   if(!exists){
  //     const user = {
  //       id: users.length + 1, // user ID`s in database start at 1 , so for a new user we need to increment the id by 1
  //       name,
  //       email,
  //       password  //TODO : hash it
  //     }
  //     users.push(user)  // add new user to database
  //
  //     req.session.userId = user.id

  //     return res.redirect('/home')
  //   }
  // }
  res.redirect('/register')
} )

app.post('/logout', (req, res) =>{
  // req.session.destroy(err =>{
  //   if(err){
  //     return res.redirect('/home')
  //   }
  //   res.clearCookie(SESS_NAME)
    res.redirect('/login')
  })


app.listen(PORT, () => console.log(
  `http://localhost:${PORT}`
))
