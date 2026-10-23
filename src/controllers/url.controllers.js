    const urlModel = require("../models/url.model");
    const {nanoid} = require("nanoid");

    async function shortenUrl(req , res){
        const {originalUrl} = req.body ;
           if (!originalUrl || typeof originalUrl !== "string" || !originalUrl.trim()) {
        return res.status(400).json({
            message: "Original URL is required"
        });
    }
     let inputUrl = originalUrl.trim();
         if (!/^https?:\/\//i.test(inputUrl)) {
    inputUrl = "https://" + inputUrl;
}

    let parsedUrl;
      try {
        parsedUrl = new URL(inputUrl);
        if (!parsedUrl.hostname.includes(".")) {
    return res.status(400).json({
        message: "Invalid domain name"
    });
}
    } catch (err) {
        return res.status(400).json({
            message: "Invalid URL"
        });
    }
     if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return res.status(400).json({
            message: "Only HTTP and HTTPS URLs are allowed"
        });
    }
        try {
            const shortCode = nanoid(6)
        const newUrl = await urlModel.create({
            originalUrl : inputUrl ,
            shortCode
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
