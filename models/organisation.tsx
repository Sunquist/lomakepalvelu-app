import { Address } from "../types/address";

const OrganisationModel = {
    Active: 1,
    Name: 1,
    DisplayName: 1,
    DatabaseLocation: 1,
    DatabaseId: 1,
    SubscriptionPlan: {
        plan: 1,
        templates: 1,
        forms: 1,
        cost: 1,
    },
    contact: {
        primary: 0,
        address: 0,
    },
    automationTypes: []
};

export default OrganisationModel;

export interface OrganisationType {
    Active: boolean,
    Name: string,
    DisplayName: string,
    DatabaseLocation: string,
    DatabaseId: string,
    SubscriptionPlan: {
        plan: string,
        templates: number,
        forms: number,
        cost: number,
    },
    contact: {
        primary: string,
        address: Address,
    },
    automationTypes: string[]
}