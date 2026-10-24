
const urlModel = require("../models/url.model");
const { nanoid } = require("nanoid");

//SHORTEN URL FUNCTION
async function shortenUrl(req, res) {
    const { originalUrl, customAlias  , expiresAt} = req.body;

    // Validate original URL input
    if (
        !originalUrl ||
        typeof originalUrl !== "string" ||
        !originalUrl.trim()
    ) {
        return res.status(400).json({
            message: "Original URL is required"
        });
    }

    // Normalize URL
    let inputUrl = originalUrl.trim();

    if (!/^https?:\/\//i.test(inputUrl)) {
        inputUrl = "https://" + inputUrl;
    }

    // Validate URL format
    let parsedUrl;

    try {
        parsedUrl = new URL(inputUrl);
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

    if (!parsedUrl.hostname.includes(".")) {
        return res.status(400).json({
            message: "Invalid domain name"
        });
    }

    // Validate custom alias
    if (customAlias !== undefined) {
        if (
            typeof customAlias !== "string" ||
            !/^[a-zA-Z0-9_-]{3,30}$/.test(customAlias)
        ) {
            return res.status(400).json({
                message:
                    "Alias must be 3-30 characters and contain only letters, numbers, hyphens, or underscores"
            });
        }
    }
    //validate expiration date
    if (expiresAt !== undefined) {
    const expiryDate = new Date(expiresAt);

    if (
        expiresAt === null ||
        expiresAt === "" ||
        !Number.isFinite(expiryDate.getTime()) ||
        expiryDate <= new Date()
    ) {
        return res.status(400).json({
            message: "Expiration date must be a valid future date"
        });
    }
}

    try {
        // Check alias uniqueness
        if (customAlias) {
            const existingUrl = await urlModel.findOne({
                shortCode: customAlias
            });

            if (existingUrl) {
                return res.status(409).json({
                    message: "Custom alias already exists"
                });
            }
        }

        // Generate or use custom short code
        const shortCode = customAlias || nanoid(6);

        const newUrl = await urlModel.create({
            originalUrl: inputUrl,
            shortCode ,
            expiresAt : expiresAt ? new Date(expiresAt) : null 
        });

        return res.status(201).json({
            message: "URL shortened successfully",
            data: newUrl
        });
    } catch (err) {
        console.error(err);

        // Handle MongoDB duplicate-key error
        if (err.code === 11000) {
            return res.status(409).json({
                message: "Short code already exists. Please try another alias."
            });
        }

        return res.status(500).json({
            message: "Can't shorten URL at the moment"
        });
    }
}

//REDIRECT URL FUNCTION 
async function redirectUrl(req, res) {
    const { shortCode} = req.params;

    try {
        const url = await urlModel.findOne({ shortCode });

        if (!url) {
            return res.status(404).json({
                message: "URL not found"
            });
        }
        if (url.expiresAt && url.expiresAt <= new Date()) {
    return res.status(410).json({
        message: "This URL has expired"
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

// FETCH ALL URLS FUNCTION
async function getUrls(req, res) {
    try {
        const pageValue = req.query.page ?? "1";
        const limitValue = req.query.limit ?? "10";

        if (
            !/^[1-9]\d*$/.test(pageValue) ||
            !/^[1-9]\d*$/.test(limitValue) ||
            Number(limitValue) > 100
        ) {
            return res.status(400).json({
                message: "Page must be positive and limit must be between 1 and 100"
            });
        }

        const page = Number(pageValue);
        const limit = Number(limitValue);
        const skip = (page - 1) * limit;

        const urls = await urlModel.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await urlModel.countDocuments();

        return res.status(200).json({
            message: "URLs fetched successfully",
            data: urls,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Unable to fetch URLs"
        });
    }
}


module.exports = { shortenUrl, redirectUrl , getUrls };
