// exports.userSignUpValidtor = (req,res)=>{

//     req.check('name',"name is required").notEmpty();
//     req.check('email','email must be 3 to 32 characters')
//        .matches(/.+\@.+\..+/)
//        .withMessage('email must contain @')
//        .isLength({
//         min:4,
//         max:32,
//        });
//     req.check('password','password is required').notEmpty()
//     req.check('password')
//        .islength({min:6,})
//        .withMessage("password must contain atleast 6 characters")
//        .matches(/\d/)
//        .withMessage('password must contain a number')
//        const errors = req.validationErrors()
//        if(errors){
//         const firstError = errors.map(err=>err.message)[0]
//         return res.status(400).json({error: firstError})
//        }
//        next()
// } 

// const { body, validationResult } = require('express-validator');

// exports.userSignUpValidator = [
//     body('name', 'Name is required').notEmpty(),
//     body('email', 'Email must be 3 to 32 characters')
//         .isLength({ min: 3, max: 32 })
//         .matches(/.+\@.+\..+/)
//         .withMessage('Email must contain @'),
//     body('password', 'Password is required').notEmpty(),
//     body('password')
//         .isLength({ min: 6 })
//         .withMessage('Password must contain at least 6 characters')
//         .matches(/\d/)
//         .withMessage('Password must contain a number'),
//     (req, res, next) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             const firstError = errors.array().map(error => error.msg)[0];
//             return res.status(400).json({ error: firstError });
//         }
//         next();
//     }
// ];


const { body, validationResult } = require('express-validator');

exports.userSignUpValidator = [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Email must be 3 to 32 characters')
        .isLength({ min: 3, max: 32 })
        .isEmail()
        .withMessage('Email must be valid'),
    body('password', 'Password is required').notEmpty(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const firstError = errors.array().map(error => error.msg)[0];
            return res.status(400).json({ error: firstError });
        }
        next();
    }
];