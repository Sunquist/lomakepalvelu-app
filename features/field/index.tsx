import { TextFieldRender, TextFieldPropModel, TextFieldAdminRender, TextFieldAdminRenderOptions, GetDefaultTextField } from "./components/textfield"
import { SelectFieldRender, SelectFieldAdminRender, SelectFieldAdminRenderOptions, SelectFieldPropModel, GetDefaultSelectField } from "./components/selectfield"


export const FieldTypes = {
    BasicTypes: [
        {
            type: "text",
            render: TextFieldRender,
            renderAdmin: TextFieldAdminRender,
            renderAdminOptions: TextFieldAdminRenderOptions,
            adminLabel: "TEXTFIELD",
            props: TextFieldPropModel,
            getDefault: GetDefaultTextField
        },
        {
            type: "select",
            render: SelectFieldRender,
            renderAdmin: SelectFieldAdminRender,
            renderAdminOptions: SelectFieldAdminRenderOptions,
            adminLabel: "SELECTFIELD",
            props: SelectFieldPropModel,
            getDefault: GetDefaultSelectField
        }
    ],
}

export interface FieldTypeListItem {
    type: string,
    render?: any,
    renderAdmin?: any,
    renderAdminOptions?: any,
    adminLabel?: string,
    props?: any,
    getDefault?: any
}

export const FIELDS = [...FieldTypes.BasicTypes].reduce((pv: any, cv: any) => {
    return {
        ...pv,
        [cv.type]: cv
    }
}, {})