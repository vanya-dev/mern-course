const {Router} = require('express')
const config = require('config')
const shortid = require('shortid')
const auth = require('../middleware/auth.middleware')
const Link = require('../models/Link')

const router = Router()

router.post('/generate', auth, async (req, res) => {
    try {
        const baseUrl = config.get('baseUrl')
        const {from} = req.body

        const code = shortid.generate()

        const exicting = await Link.findOne({from})

        if (exicting) {
            return res.json({link: exicting})
        }

        const to = baseUrl + '/t/' + code

        const link = new Link({code, to, from, owner: req.user.userId})

        await link.save()

        res.status(201).json({link})

    } catch (e) {
        res.status(500).json({message: 'Something goes don\'t so, try again'})
    }
})

router.get('/', auth, async (req, res) => {
    try {
        const links = await Link.find({owner: req.user.userId})
        res.json(links)
    } catch (e) {
        res.status(500).json({message: 'Something goes don\'t so, try again'})
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const link = await Link.findById(req.params.id)
        res.json(link)
    } catch (e) {
        res.status(500).json({message: 'Something goes don\'t so, try again'})
    }
})

module.exports = router