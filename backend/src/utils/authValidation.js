function validateRegisterInput(name, email, password) {
    if (
        typeof name !== "string" || !name.trim() ||
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
        typeof password !== "string" ||
        password.length < 8
    ) {
        return {
            error: "Valid name, email, and password (8+ characters) are required"
        };
    }

    return { value: true };
}

function validateLoginInput(email, password) {
    if (
        typeof email !== "string" || !email.trim() ||
        typeof password !== "string" || !password
    ) {
        return { error: "Email and password are required" };
    }

    return { value: true };
}

module.exports = {
    validateRegisterInput,
    validateLoginInput
};