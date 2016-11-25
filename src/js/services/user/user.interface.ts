export interface UserNotification {
    group: string;
    events: any[];
};

export interface UserSubscription {
    code: string;
    validThrough: string;
};

export interface UserProfile {
    userId: number;
    revision: number;
    email: string;
    public: {
        avatar: string;
        lastName: string;
        firstName: string;
        background: string;
    };
    notifications: UserNotification[];
    subscriptions: UserSubscription[];
}