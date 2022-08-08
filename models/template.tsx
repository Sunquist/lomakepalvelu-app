import VerifyModel from "../utils/VerifyModel";
import AutomationModel, { AutomationType } from "./automation";
import SectionModel from "./section";
import StageModel, { StageType } from "./stage";
import { v4 as uuidv4 } from 'uuid';

const TemplateHistoryObject = {
    _id: 1,
    _ts: 1,
    CreatedBy: 1,
    CreatedByName: 1,
    Active: 0,
}

interface SecurityProps {
    PublicEnabled?: boolean,
    PublicLink?: string,
    TTL?: string,
    TTE?: string,
}

const TemplateModel = {
    Name: 0,
    Folder: 0,
    CreatedBy: 0,
    CreatedByName: 0,
    Theme: 0,
    VersionHistory: [TemplateHistoryObject],
    Type: 0,
    Layout: 0,
    Stages: [StageModel],
    Automations: [AutomationModel],
    Security: {
        PublicEnabled: 0,
        PublicLink: 0,
        TTL: 0,
        TTE: 0,
    },
    _id: 0,
    _ts: 0,
};

export default TemplateModel;

export const getDefaultTemplate = () => {
    return VerifyModel({
        Name: "",
        Type: "dynamic",
        Layout: "contained",
        Stages: [
            {
                Name: "Default Stage",
                id: uuidv4(),
                Columns: 1,
                Sections: [
                    {
                        Name: "section1",
                        Type: 'contained',
                        id: uuidv4(),
                    }
                ]
            }
        ],
        Security: {
            PublicEnabled: false
        }
    }, TemplateModel)
}

export interface TemplateType {
    Name?: string,
    Folder?: string,
    CreatedBy?: string,
    CreatedByName?: string,
    Theme?: string,
    VersionHistory?: any[],
    Type?: "dynamic" | "static" | "info",
    Layout?: "contained" | "filled" | "directional",
    Stages?: StageType[],
    Automations?: AutomationType[],
    Security?: SecurityProps,
    _id?: string,
    _ts?: number,
}