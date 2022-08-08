import FieldModel, { FieldType } from "./field";

const SectionModel = {
    Name: 1,
    Title: 0,
    Type: 0,
    Description: 0,    
    Fields: [FieldModel],
    id: 1,
};

export default SectionModel;

export interface SectionType {
    Name: string,
    Type?: 'contained' | 'fill',
    Label?: string,
    Description?: string,
    Fields?: FieldType[],
    id: string
}