
export interface LoginUserProps {
    user: string;
    password: string;
}

export interface ErrorAuthResponse {
    error: Error;
    debug: Debug;
}

export interface Debug {
    source: string;
    stages: Stages;
}

export interface Stages {
    success: string[];
    failure: string[];
}

export interface Error {
    code:    number;
    message: string;
}

export interface SuccessLoginResponse {
    code:    number;
    token:   string;
    entity:  string;
    message: string;
}
