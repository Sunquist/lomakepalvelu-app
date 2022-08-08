const FieldModel = {
    id: 1,
    key: 1,
    label: 1,
    disabled: 0,
    required: 0,
    hidden: 0,
    type: 0,
    typeProperties: 0,
    content: 0,
    visibility: 0,
    style: 0,
    children: 0,
};

export default FieldModel;

export interface FieldType {
    id: string,
    key: string,
    label: string,
    disabled?: boolean,
    required?: boolean,
    hidden?: boolean,
    type?: string,
    typeProperties?: any,
    content?: string,
    visibility?: any,
    style?: any,
    children?: any[]
}