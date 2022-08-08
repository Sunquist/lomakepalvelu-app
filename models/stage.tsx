import SectionModel, { SectionType } from "./section";

const StageModel = {
    Name: 0,
    Label: 0,
    Description: 0,
    Icon: 0,
    Columns: 0,
    Sections: [SectionModel],
    sectionDirection: 0,
    layoutType: 0,
    id: 1,
};

export default StageModel;

export interface StageType {
    Name: string,
    Label?: string,
    Description?: string,
    Icon?: string,
    Columns?: number,
    Sections?: SectionType[],
    sectionDirection?: string,
    layoutType?: string,
    id: string
}