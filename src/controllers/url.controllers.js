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
                message : "Cant Shorten URL at the momnent"
            })
        }
    }

    module.exports = {shortenUrl};
