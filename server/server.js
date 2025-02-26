const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config();
const DatabaseConnection = require('./config.js');
const { error } = require('console');



app.use(cors());


db = DatabaseConnection();

app.get('/',(req,res)=>{
   db.query('SELECT id,first_name,other_names,phone_number,image_url,favourite_status FROM contact_profiles', (err, results) => {
    if (err) {
      console.error("Database query error:", err); // Log error for debugging
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json(results);
  })
})


app.get('/favourites',(req,res)=>{
  db.query('SELECT id,first_name,other_names,phone_number,image_url FROM contact_profiles WHERE favourite_status = True', (err, results) => {
   if (err) {
     console.error("Database query error:", err); // Log error for debugging
     return res.status(500).json({ message: "Internal Server Error" });
   }
   res.status(200).json(results);
 })
})


app.get('/favstatus',(req,res)=>{
    db.query('SELECT EXISTS (SELECT 1 FROM contact_profiles WHERE favourite_status = TRUE) AS exists_status', (err, results) => {
    if (err) {
      console.error("Database query error:", err); 
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json(results[0]);
  })
})



app.get('/detail/:id',(req,res)=>{
    const {id} = req.params;
    const parsedId = parseInt(id) 
    if (isNaN(parsedId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    db.query('SELECT * FROM contact_profiles LEFT JOIN media_handles ON contact_profiles.id = media_handles.contact_id WHERE contact_profiles.id  = ?',parsedId,(err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json(results[0]);
  })
})


app.get('/detail/occupations/:id',(req,res)=>{
    const {id} = req.params;
    const parsedId = parseInt(id) 
    if (isNaN(parsedId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    db.query('SELECT contact_profiles.id AS contactID, occupations.id AS occupationID,occupation FROM contact_profiles LEFT JOIN occupations ON contact_profiles.id = occupations.contact_id WHERE contact_profiles.id  = ?',parsedId,(err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json(results);
  })
})


app.get("/search", (req, res) => {
  const searchTerm = decodeURIComponent(req.query.searchParams ? req.query.searchParams.toLowerCase() : ""); 
  console.log("Search Term:", searchTerm);
  
  const values = [
    `%${searchTerm}%`, `%${searchTerm}%`, 
    searchTerm, searchTerm,               
    `%${searchTerm}%`,                     
    searchTerm                             
  ];

  console.log("Query Values:", values);

  const query = `
    SELECT * FROM contact_profiles 
    WHERE 
      LOWER(first_name) LIKE ? 
      OR LOWER(other_names) LIKE ? 
      OR SOUNDEX(LOWER(first_name)) = SOUNDEX(?) 
      OR SOUNDEX(LOWER(other_names)) = SOUNDEX(?) 
      OR LOWER(CONCAT(first_name, ' ', other_names)) LIKE ? 
      OR SOUNDEX(LOWER(CONCAT(first_name, ' ', other_names))) = SOUNDEX(?);
  `;

  db.query(query, values, (err, results) => {
    if (err) {
      console.log("Inside error");
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json(results);
  });
});



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
