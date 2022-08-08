import FieldModel from "../../../models/field"
import VerifyModel from "../../../utils/VerifyModel"
import { v4 as uuidv4 } from 'uuid'
import { translate } from "../../../utils/translate"
import DraggableAdminField from "./adminfield"

export function TextFieldRender () {
    
}

export function TextFieldAdminRender (props: any) {
    return <DraggableAdminField index={props.index} field={props.field} />
}

export function TextFieldAdminRenderOptions () {

}

export function GetDefaultTextField (index: number = 1) {
    const id = uuidv4()
    return VerifyModel({
        id,
        key: id,
        type: "text",
        label: `${translate('field_text_label')} ${index}`
    }, FieldModel)
}

export const TextFieldPropModel = {
    validation: 0,
}

interface TextFieldProps {
    validation: 'number' | 'email',
}