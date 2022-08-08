const SessionDocumentModel = {
    Username: 1,
    Name: 1,
    Provider: 1,
	Organization: 0,
	Role: 0,
	Roles: [],
	Permissions: [],
	AlternateOrganizations: [],
    Preferences: {
        theme: 0
    }
};

export default SessionDocumentModel;

export interface SessionDocument {
    Username: string,
    Name?: string,
    Provider: string,
	Organization?: string,
	Role?: string,
	Roles?: string[],
	Permissions?: string[],
	AlternateOrganizations?: string[],
    Preferences?: {
        theme: string
    }
}