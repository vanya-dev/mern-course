const {Router} = require('express')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('config')
const User = require('../models/User')

const router = Router()

router.post('/register', [
    check('email', 'Invalid email').isEmail(),
    check('password', 'Min length password 6 symbols').isLength({min: 6})
], async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            res.status(400).json({errors: errors.array(), message: 'Invalid data by registration'})
        }

        const {email, password} = req.body

        const candidate = await User.findOne({email})

        if (candidate) {
            return res.status(400).json({message: 'Such user already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        console.log(email + ' - ' + hashedPassword)

        const user = new User({email, password: hashedPassword})

        await user.save()

        res.status(201).json({message: 'User has been created'})

    } catch (e) {
        res.status(500).json({message: 'Something goes don\'t so, try again'})
    }
})

router.post('/login', [
    check('email', 'Input valid email').normalizeEmail().isEmail(),
    check('password', 'Input password').exists()
], async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            res.status(400).json({errors: errors.array(), message: 'Invalid data by input in the system'})
        }

        const {email, password} = req.body

        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({message: 'User don\'t find'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({message: 'Invalid password, try again'})
        }

        const token = jwt.sign({userId: user.id}, config.get('jwtSecret'), {expiresIn: '1h'})
        
        res.json({token, userId: user.id})

    } catch (e) {
        res.status(500).json({message: 'Something goes don\'t so, try again'})
    }
})

module.exports = router