const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv')
dotenv.config();
const DatabaseConnection = require('./config.js');



db = DatabaseConnection();

db.query('SELECT * FROM contact_profiles', (err, results) => {
  if (err) throw err;
  console.log(results);
})


// app.get('/insert',(req,res)=>{
//   const countryname = 'Canada';
//   const population = 800000;
  
//   db.query('INSERT INTO countries (countryName,population) VALUES (?,?)',[countryname,population],(err,result)=>{
//     if(err){
//       console.log(err);
//     } 
//   else{
//       res.send(result);
//     }
//   }
// );
// });


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
