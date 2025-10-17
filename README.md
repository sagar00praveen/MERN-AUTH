<img width="800" height="773" alt="makephotogallery net_1760634110058" src="https://github.com/user-attachments/assets/a851ae1c-3b1e-4cf5-9eaf-b28d25f824c8" />

i created mern email authentication 

you can download and run it by 

run the server: cd server 
->npm install
->npm run server
next run feontend : cd client 
->npm install
->npm run dev

for environment variables
PORT=4000
NODE_ENV=development

# -----------------------
# MONGODB CONFIG
# -----------------------
MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster0.mongodb.net/mern-auth

# -----------------------
# JWT CONFIG
# -----------------------
JWT_SECRET=your_super_secret_jwt_key_here

# -----------------------
# EMAIL (NODEMAILER) CONFIG
# -----------------------
SENDER_EMAIL=your_email@example.com
SENDER_PASS=your_email_app_password

# Example for Gmail:
# SENDER_EMAIL=youremail@gmail.com
# SENDER_PASS=your_app_specific_password
