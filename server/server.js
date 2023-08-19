import express from "express";
import mysql from 'mysql2';
import cors from 'cors';
import cookieParser from "cookie-parser";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors(
    {
        origin: ["http://localhost:5173"],
        methods: ["POST", "GET"],
        credentials: true
    }
));

app.use(express.json());        
app.use(express.urlencoded({extended: true})); 
app.use(cookieParser());

const con = mysql.createConnection({
    host: "localhost",
    user: "rebel",
    database: "testform",
    password: "rebelpass"
});

con.connect(function(err) {
    if (err) {
        console.log("Error in connection" + err.message);
    } else  {
        console.log("Connected");
    }
});

    const validatingEmail = (email) => {
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    };

    const validate = (vale, valp) => {
        let errors = {};
        if (!vale) {
             errors.email = "Введіть Email";
        } else if (validatingEmail(vale) === false) {
             errors.email = "Некоректний Email";
        } else if (!valp) {
             errors.password = "Введіть Пароль";
        } else if (valp.length < 6) {
             errors.password = "Пароль занадто короткий";
        }
        return errors;
    }

app.post('/login', (req, res) => {

    let err2 = validate(req.body.email, req.body.password);

    if (err2 && (err2.email || err2.password)) return res.json({Status: "Error", Error: err2.email ? err2.email : err2.password })

    const sql = "SELECT * FROM users WHERE email = ?";
    con.query(sql, [req.body.email], (err, result) => {
        if(err) return res.json({Status: "Error", Error: "Error in query"});
        if(result.length > 0) {
            bcrypt.compare(req.body.password.toString(), result[0].password, (err, response)=> {
                if(err) return res.json({Error: "password error"});
                if(response) {
                    const token = jwt.sign({role: "admin", id: result[0].id}, "jwt-secret-key", {expiresIn: '1d'});
                    res.cookie('token', token);
                    return res.json({Status: "Success", id: result[0].id})
                } else {
                    return res.json({Status: "Error", Error: "Wrong Email or Password"});
                }
                
            })
        } else {
            return res.json({Status: "Error", Error: "Невірний email  або пароль"});
        }
    })
    
});


app.get('/get/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM users where id = ?";
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: "error in sql"});
        return res.json({Status: "Success", Result: result})
    })
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.json({Error: "Ви не авторизовані"});
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err) return res.json({Error: "невірний токен"});
            req.role = decoded.role;
            req.id = decoded.id;
            next();
        } )
    }
};

app.get('/dashboard',verifyUser, (req, res) => {
    return res.json({Status: "Success", role: req.role, id: req.id})
})

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Success"});
});

const validateName = (name) => {
    if (!name) { 
        return false;
    }
}
const validateCyr = (name) => {
    const cyrillicPattern = /^[А-Яа-яёЁіІїЇ]+(?:[-'\s][А-Яа-яёЁіІїЇ]+)*$/;

    if (cyrillicPattern.test(name) === false) {
        return false;
    }
}
const validatePhone = (phone) => {
    const Pattern = /^\+380\d{3}\d{2}\d{2}\d{2}$/;

    if (Pattern.test(phone) === false) {
        return false;
    } 
}

const existedEmail = (email) => {
    const exsql = "SELECT `id` FROM `users` WHERE `email` = ?";
    var state = true;
    con.query(exsql, [email], (err, result) => {
        if(err) return false;

        if (result.length > 0) {

            if(result[0].id >= 0) {


                return false;
            }
        } else {
            return false;
        }

    });


}


app.post('/register', (req, res) => {
    const sql = "INSERT INTO users (`fname`,`lname`,`email`,`password`,`phone`) VALUES (?)";
    if (validateName(req.body.fname) === false) {
        return res.json({Error: "некоректне імя"});
    } else
    if (validateCyr(req.body.fname) === false) {
        return res.json({Error: "імя кирилицею пліз"});
    } else
    if (validateName(req.body.lname) === false) {
        return res.json({Error: "некоректне прізвище"});
    } else
    if (validateCyr(req.body.lname) === false) {
        return res.json({Error: "прізвище кирилицею пліз"});
    } else
    if (!req.body.email) {
        return res.json({Error: "Введіть Email"});
   } else 
   if (validatingEmail(req.body.email) === false) {
        return res.json({Error: "Некоректний Email"});
   } else
   if (existedEmail(req.body.email) === false) {
        return res.json({Error: "Такий Email вже зареєстрований"});
   } else
   if (validatePhone(req.body.phone) === false) {
        return res.json({Error: "Некоректний номер телефону"});
    } else
    if (req.body.password && req.body.confirmpassword && req.body.password === req.body.confirmpassword) {

        bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
            if(err) return res.json({Error: "Помилка хешування паролю"});
            const values = [
                req.body.fname,
                req.body.lname,
                req.body.email,
                hash,
                req.body.phone
            ]

            con.query(sql, [values], (err, result) => {
                if(err) return res.json({Error: "помилка реєстраційного запиту"});
                return res.json({Status: "Success"});
            });
        });
    } else {
        if(validateName(req.body.password) === false) {
            return res.json({Error: "Введіть пароль"});
        } else if (validateName(req.body.confirmpassword) === false) {
            return res.json({Error: "підтвердіть пароль"});
        } else {
            return res.json({Error: "паролі не співпадають"});
        }
    }
})

app.listen(5000, () => {
    console.log("Running");
});