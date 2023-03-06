import { v4 as uuidv4 } from 'uuid'

export const GenerateKey = (): string => {
    return uuidv4().replaceAll("-", "");
}