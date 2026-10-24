const urlModel = require("../models/url.model");
const { nanoid } = require("nanoid");
const {
    validateUrl,
    validateExpiry
} = require("../utils/urlValidation");

// SHORTEN URL
async function shortenUrl(req, res) {
    const { originalUrl, customAlias, expiresAt } = req.body;

    const urlResult = validateUrl(originalUrl);

    if (urlResult.error) {
        return res.status(400).json({ message: urlResult.error });
    }

    if (
        customAlias !== undefined &&
        (
            typeof customAlias !== "string" ||
            !/^[a-zA-Z0-9_-]{3,30}$/.test(customAlias)
        )
    ) {
        return res.status(400).json({
            message: "Alias must be 3-30 characters and contain only letters, numbers, hyphens, or underscores"
        });
    }

    let expiryDate = null;

    if (expiresAt !== undefined) {
        const expiryResult = validateExpiry(expiresAt);

        if (expiryResult.error) {
            return res.status(400).json({
                message: expiryResult.error
            });
        }

        expiryDate = expiryResult.value;
    }

    try {
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

        const newUrl = await urlModel.create({
            originalUrl: urlResult.value,
            shortCode: customAlias || nanoid(6),
            expiresAt: expiryDate
        });

        return res.status(201).json({
            message: "URL shortened successfully",
            data: newUrl
        });
    } catch (err) {
        console.error(err);

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

// REDIRECT URL
async function redirectUrl(req, res) {
    const { shortCode } = req.params;

    try {
        const url = await urlModel.findOne({ shortCode });

        if (!url) {
            return res.status(404).json({ message: "URL not found" });
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

// FETCH URLS WITH PAGINATION
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

        const [urls, total] = await Promise.all([
            urlModel.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            urlModel.countDocuments()
        ]);

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

// GET URL STATS
async function getUrlStats(req, res) {
    try {
        const url = await urlModel.findOne({
            shortCode: req.params.shortCode
        });

        if (!url) {
            return res.status(404).json({ message: "URL not found" });
        }

        return res.status(200).json({
            message: "URL stats fetched successfully",
            data: {
                originalUrl: url.originalUrl,
                shortCode: url.shortCode,
                totalClicks: url.clicks,
                createdAt: url.createdAt,
                expiresAt: url.expiresAt,
                isExpired: Boolean(
                    url.expiresAt && url.expiresAt <= new Date()
                )
            }
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Unable to fetch URL stats"
        });
    }
}

// DELETE URL
async function deleteUrl(req, res) {
    try {
        const url = await urlModel.findOneAndDelete({
            shortCode: req.params.shortCode
        });

        if (!url) {
            return res.status(404).json({ message: "URL not found" });
        }

        return res.status(200).json({
            message: "URL deleted successfully"
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Unable to delete URL"
        });
    }
}

// UPDATE URL
async function updateUrl(req, res) {
    const { shortCode } = req.params;
    const { originalUrl, expiresAt } = req.body;

    try {
        if (originalUrl === undefined && expiresAt === undefined) {
            return res.status(400).json({
                message: "At least one field is required to update"
            });
        }

        const url = await urlModel.findOne({ shortCode });

        if (!url) {
            return res.status(404).json({ message: "URL not found" });
        }

        if (originalUrl !== undefined) {
            const result = validateUrl(originalUrl);

            if (result.error) {
                return res.status(400).json({
                    message: result.error
                });
            }

            url.originalUrl = result.value;
        }

        if (expiresAt !== undefined) {
            const result = validateExpiry(expiresAt, true);

            if (result.error) {
                return res.status(400).json({
                    message: result.error
                });
            }

            url.expiresAt = result.value;
        }

        await url.save();

        return res.status(200).json({
            message: "URL updated successfully",
            data: url
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Unable to update URL"
        });
    }
}

module.exports = {
    shortenUrl,
    redirectUrl,
    getUrls,
    getUrlStats,
    deleteUrl,
    updateUrl
};