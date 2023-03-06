import FieldModel from "../../../models/field"
import VerifyModel from "../../../utils/VerifyModel"
import DraggableAdminField from "./adminfield"
import { GetDefaultField } from "./commonField"

export function SelectFieldRender () {
    
}

export function SelectFieldAdminRender (props: any) {
    return <DraggableAdminField key={props.id} index={props.index} field={props.field} />
}

export function SelectFieldAdminRenderOptions () {

}

export function GetDefaultSelectField (index: number = 1, t: any) {
    const _defaultField = GetDefaultField();
    return VerifyModel({
        ..._defaultField,
        type: "select",
        label: `${t('field_select_label')} ${index}`
    }, FieldModel)
}

export const SelectFieldPropModel = {
    options: 0,
}

interface SelectFieldPropType {
    options: string[],
}