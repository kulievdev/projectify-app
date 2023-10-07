import bcrypt from "bcryptjs";

class Bcrypt {
    hash = async (password) => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    };

    compare = async (password, hash) => {
        return await bcrypt.compare(password, hash);
    };
}

export const hasher = new Bcrypt();
