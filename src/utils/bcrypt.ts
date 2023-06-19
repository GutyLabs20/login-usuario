import { compare, genSalt, hash } from "bcryptjs"

const encrypt = async (pass: string) => {
    const salt = await genSalt(10);
    const passwordHast = await hash(pass, salt);
    return passwordHast;
};

const veryfied =async (pass:string, passHash: string) => {
    const isCorrect = await compare(pass, passHash);
    return isCorrect;
}

export { encrypt, veryfied };