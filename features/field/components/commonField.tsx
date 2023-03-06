import { FieldType } from "../../../models/field"
import { GenerateKey } from "../../../utils/common"

export const GetDefaultField = (): FieldType => {
    const id = GenerateKey()
    return {
        id,
        key: id,
        type: "text",
        label: `Not set`
    }
}