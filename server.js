const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    const ShortUrls = await ShortUrl.find();
    res.render('index', { shortUrls: ShortUrls });
})

app.post('/short', async (req, res) =>{
    await ShortUrl.create({ full: req.body.fullUrl });

    res.redirect('/');
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
    if (!shortUrl) return res.sendStatus(404);

    shortUrl.clicks++;
    shortUrl.save();

    res.redirect(shortUrl.full);
})

app.listen(process.env.PORT || 5000);