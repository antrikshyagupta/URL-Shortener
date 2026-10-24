// Validate and normalize original URL
function validateUrl(originalUrl) {
    if (
        typeof originalUrl !== "string" ||
        !originalUrl.trim()
    ) {
        return { error: "Original URL is required" };
    }

    let inputUrl = originalUrl.trim();

    if (!/^https?:\/\//i.test(inputUrl)) {
        inputUrl = "https://" + inputUrl;
    }

    let parsedUrl;

    try {
        parsedUrl = new URL(inputUrl);
    } catch {
        return { error: "Invalid URL" };
    }

    if (
        !["http:", "https:"].includes(parsedUrl.protocol) ||
        !parsedUrl.hostname.includes(".")
    ) {
        return { error: "Invalid domain name or protocol" };
    }

    return { value: inputUrl };
}

// Validate expiration date
function validateExpiry(expiresAt, allowNull = false) {
    if (expiresAt === null && allowNull) {
        return { value: null };
    }

    if (
        typeof expiresAt !== "string" ||
        !expiresAt.trim()
    ) {
        return { error: "Expiration date must be a valid future date" };
    }

    const expiryDate = new Date(expiresAt);

    if (
        !Number.isFinite(expiryDate.getTime()) ||
        expiryDate <= new Date()
    ) {
        return { error: "Expiration date must be a valid future date" };
    }

    return { value: expiryDate };
}

module.exports = {
    validateUrl,
    validateExpiry
};