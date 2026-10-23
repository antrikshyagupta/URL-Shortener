    const urlModel = require("../models/url.model");
    const {nanoid} = require("nanoid");

    async function shortenUrl(req , res){
        const {originalUrl} = req.body ;
        if(!originalUrl){
            return res.status(400).json({
            message: "Original URL is required"
        });
        }

        try {
            const shortCode = nanoid(6)
        const newUrl = await urlModel.create({
            originalUrl ,shortCode
        })

        
    return res.status(201).json({
        message: "URL shortened successfully",
        data: newUrl
    });
        }
        catch(err){
            console.error(err)
            return res.status(500).json({
                message : "Can't Shorten URL at the moment"
            })
        }
    }
    
async function redirectUrl(req, res) {
    const { shortCode } = req.params;

    try {
        const url = await urlModel.findOne({ shortCode });

        if (!url) {
            return res.status(404).json({
                message: "URL not found"
            });
        }

        url.clicks++;
        await url.save();

        return res.redirect(url.originalUrl);

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Unable to redirect URL at the moment"
        });
    }
}

        

    module.exports = {shortenUrl ,redirectUrl};
