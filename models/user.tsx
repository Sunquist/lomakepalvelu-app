const UserModel = {
    Username: 1,
    Name: 1,
    Admin: 0,
    Password: 0,
    Providers: 0,
    SignupCode: 0,
    AuthCode: 0,
	Organizations: [],
    Preferences: {
        theme: 0
    }
};

export default UserModel;

export interface User {
    _id?: string,
    _ts?: number,
    Username: string,
    Name?: string,
    Admin?: boolean,
    Password?: string,
    Providers?: object,
	Organizations?: string[],
    SignupCode?: string,
    AuthCode?: string,
    Preferences?: {
        theme: string
    }
}