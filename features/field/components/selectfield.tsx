import FieldModel from "../../../models/field"
import VerifyModel from "../../../utils/VerifyModel"
import { v4 as uuidv4 } from 'uuid'
import { translate } from "../../../utils/translate"
import DraggableTextFieldAdmin from "./adminfield"

export function SelectFieldRender () {
    
}

export function SelectFieldAdminRender (props: any) {
    return <DraggableTextFieldAdmin index={props.index} field={props.field} />
}

export function SelectFieldAdminRenderOptions () {

}

export function GetDefaultSelectField (index: number = 1) {
    const id = uuidv4()
    return VerifyModel({
        id,
        key: id,
        type: "select",
        label: `${translate('field_select_label')} ${index}`
    }, FieldModel)
}

export const SelectFieldPropModel = {
    options: 0,
}

interface SelectFieldPropType {
    options: string[],
}