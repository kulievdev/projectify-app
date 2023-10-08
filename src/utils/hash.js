import bcrypt from "bcryptjs";
import cryptojs from "crypto-js";

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

class Crypto {
    generateRandomString = () => {
        const chars = "abcdefghijklmnopqrstuvwxyz";
        let randomString = "";

        for (let i = 0; i < 10; i++) {
            const randomIdx = Math.floor(Math.random() * 26);

            randomString += chars[randomIdx];
        }

        return new Date().toISOString() + randomString;
    };

    hash = (input) => {
        const hash = cryptojs.SHA256(input);
        const hashString = hash.toString(cryptojs.enc.Hex);
        return hashString;
    };

    createToken = () => {
        const randomString = this.generateRandomString();
        const hashedString = this.hash(randomString);
        return hashedString;
    };

    compare = (token, hashedToken) => {
        return hashedToken === this.hash(token);
    };
}

export const hasher = new Bcrypt();
export const crypto = new Crypto();
