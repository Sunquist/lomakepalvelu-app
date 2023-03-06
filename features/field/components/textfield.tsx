import FieldModel, { FieldType } from "../../../models/field"
import VerifyModel from "../../../utils/VerifyModel"
import DraggableAdminField from "./adminfield"
import { GetDefaultField } from "./commonField"

export function TextFieldRender () {
    
}

export function TextFieldAdminRender (props: any) {
    return <DraggableAdminField key={props.id} index={props.index} field={props.field} />
}

export function TextFieldAdminRenderOptions () {

}

export function GetDefaultTextField (index: number = 1, t: any): TextFieldType {
    const _defaultField = GetDefaultField();
    return VerifyModel({
        ..._defaultField,
        type: "text",
        label: `${t('field_text_label')} ${index}`
    }, FieldModel)
}

export const TextFieldPropModel = {
    validation: 0,
}

export interface TextFieldType extends FieldType {
    typeProperties: TextFieldProps
}

interface TextFieldProps {
    validation: 'number' | 'email',
}