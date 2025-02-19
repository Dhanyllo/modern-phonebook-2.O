-- creating the modern_phonebook database
create database Modern_Phonebook;

-- selecting the modern_phonebook database
use modern_phonebook;

-- creating the contact_profiles table
CREATE TABLE contact_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    other_names VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(50) DEFAULT "user@example.com",
    home_address VARCHAR(200),
    favourite_status BOOLEAN,
    image_url VARCHAR(255)
);

ALTER TABLE contact_profiles 
ADD COLUMN created_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW();


-- creating the media_handles table
CREATE TABLE media_handles (
    field_id INT AUTO_INCREMENT PRIMARY KEY,
    twitter VARCHAR(200),
	instagram VARCHAR(200),
	facebook VARCHAR(200),
	whatsapp VARCHAR(200),
	linkedin VARCHAR(200),
    contact_id INT NOT NULL,
	FOREIGN KEY(contact_id) REFERENCES contact_profiles(id)
    ON DELETE CASCADE    
);

-- Creating the occupations table
CREATE TABLE occupations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    occupation VARCHAR(50),
    contact_id INT NOT NULL,
	FOREIGN KEY(contact_id) REFERENCES contact_profiles(id) 
    ON DELETE CASCADE
);


-- DUMMY DATA INSERTED FOR TESTING PURPOSES


-- INSERT INTO contact_profiles (first_name, other_names, phone_number, email, home_address, favourite_status, image_url) VALUES
-- ('John', 'Doe', 1234567890, 'john.doe@example.com', '123 Main St, NY', TRUE, 'profile1.jpg'),
-- ('Jane', 'Smith', 2345678901, 'jane.smith@example.com', '456 Elm St, CA', FALSE, 'profile2.jpg'),
-- ('Michael', 'Johnson', 3456789012, 'michael.j@example.com', '789 Pine St, TX', TRUE, 'profile3.jpg'),
-- ('Emily', 'Davis', 4567890123, 'emily.d@example.com', '101 Oak St, FL', FALSE, 'profile4.jpg'),
-- ('David', 'Wilson', 5678901234, 'david.w@example.com', '202 Cedar St, WA', TRUE, 'profile5.jpg'),
-- ('Sophia', 'Martinez', 6789012345, 'sophia.m@example.com', '303 Birch St, IL', FALSE, 'profile6.jpg'),
-- ('Daniel', 'Anderson', 7890123456, 'daniel.a@example.com', '404 Walnut St, GA', TRUE, 'profile7.jpg'),
-- ('Olivia', 'Thomas', 8901234567, 'olivia.t@example.com', '505 Spruce St, CO', FALSE, 'profile8.jpg'),
-- ('Matthew', 'Taylor', 9012345678, 'matthew.t@example.com', '606 Maple St, AZ', TRUE, 'profile9.jpg'),
-- ('Ava', 'Hernandez', 1230984567, 'ava.h@example.com', '707 Cherry St, NV', FALSE, 'profile10.jpg'),
-- ('James', 'Moore', 9876543210, 'james.m@example.com', '808 Willow St, OR', TRUE, 'profile11.jpg'),
-- ('Isabella', 'White', 8765432109, 'isabella.w@example.com', '909 Ash St, MI', FALSE, 'profile12.jpg'),
-- ('William', 'Clark', 7654321098, 'william.c@example.com', '1010 Palm St, PA', TRUE, 'profile13.jpg'),
-- ('Mia', 'Rodriguez', 6543210987, 'mia.r@example.com', '1111 Fir St, OH', FALSE, 'profile14.jpg'),
-- ('Ethan', 'Lewis', 5432109876, 'ethan.l@example.com', '1212 Redwood St, NC', TRUE, 'profile15.jpg');



-- INSERT INTO media_handles (twitter, instagram, facebook, whatsapp, linkedin, contact_id) VALUES
-- ('https://twitter.com/johndoe', 'https://instagram.com/johndoe', 'https://facebook.com/johndoe', 'https://wa.me/1234567890', 'https://linkedin.com/in/johndoe', 1),
-- ('https://twitter.com/janesmith', 'https://instagram.com/janesmith', 'https://facebook.com/janesmith', 'https://wa.me/2345678901', 'https://linkedin.com/in/janesmith', 2),
-- ('https://twitter.com/michaeljohnson', 'https://instagram.com/michaeljohnson', 'https://facebook.com/michaeljohnson', 'https://wa.me/3456789012', 'https://linkedin.com/in/michaeljohnson', 3),
-- ('https://twitter.com/emilydavis', 'https://instagram.com/emilydavis', 'https://facebook.com/emilydavis', 'https://wa.me/4567890123', 'https://linkedin.com/in/emilydavis', 4),
-- ('https://twitter.com/davidwilson', 'https://instagram.com/davidwilson', 'https://facebook.com/davidwilson', 'https://wa.me/5678901234', 'https://linkedin.com/in/davidwilson', 5),
-- ('https://twitter.com/sophiamartinez', 'https://instagram.com/sophiamartinez', 'https://facebook.com/sophiamartinez', 'https://wa.me/6789012345', 'https://linkedin.com/in/sophiamartinez', 6),
-- ('https://twitter.com/danielanderson', 'https://instagram.com/danielanderson', 'https://facebook.com/danielanderson', 'https://wa.me/7890123456', 'https://linkedin.com/in/danielanderson', 7),
-- ('https://twitter.com/oliviathomas', 'https://instagram.com/oliviathomas', 'https://facebook.com/oliviathomas', 'https://wa.me/8901234567', 'https://linkedin.com/in/oliviathomas', 8),
-- ('https://twitter.com/matthewtaylor', 'https://instagram.com/matthewtaylor', 'https://facebook.com/matthewtaylor', 'https://wa.me/9012345678', 'https://linkedin.com/in/matthewtaylor', 9),
-- ('https://twitter.com/avahernandez', 'https://instagram.com/avahernandez', 'https://facebook.com/avahernandez', 'https://wa.me/1230984567', 'https://linkedin.com/in/avahernandez', 10),
-- ('https://twitter.com/jamesmoore', 'https://instagram.com/jamesmoore', 'https://facebook.com/jamesmoore', 'https://wa.me/9876543210', 'https://linkedin.com/in/jamesmoore', 11),
-- ('https://twitter.com/isabellawhite', 'https://instagram.com/isabellawhite', 'https://facebook.com/isabellawhite', 'https://wa.me/8765432109', 'https://linkedin.com/in/isabellawhite', 12),
-- ('https://twitter.com/williamclark', 'https://instagram.com/williamclark', 'https://facebook.com/williamclark', 'https://wa.me/7654321098', 'https://linkedin.com/in/williamclark', 13),
-- ('https://twitter.com/miarodriguez', 'https://instagram.com/miarodriguez', 'https://facebook.com/miarodriguez', 'https://wa.me/6543210987', 'https://linkedin.com/in/miarodriguez', 14),
-- ('https://twitter.com/ethanlewis', 'https://instagram.com/ethanlewis', 'https://facebook.com/ethanlewis', 'https://wa.me/5432109876', 'https://linkedin.com/in/ethanlewis', 15);



-- INSERT INTO occupations (occupation, contact_id) VALUES
-- ('Software Engineer', 1),
-- ('Graphic Designer', 2),
-- ('Doctor', 3),
-- ('Teacher', 4),
-- ('Civil Engineer', 5),
-- ('Marketing Manager', 6),
-- ('Data Scientist', 7),
-- ('Photographer', 8),
-- ('Financial Analyst', 9),
-- ('Mechanical Engineer', 10),
-- ('Lawyer', 11),
-- ('Musician', 12),
-- ('Chef', 13),
-- ('Journalist', 14),
-- ('Architect', 15);

-- TESTING THE DELETION WITH CASCADE
DELETE FROM contact_profiles WHERE id = 15;



