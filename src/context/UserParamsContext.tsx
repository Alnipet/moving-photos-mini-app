import { createContext, FC, PropsWithChildren } from "react";
import { GetLaunchParamsResponse } from "@vkontakte/vk-bridge";

type TValue = {
    launchParams: GetLaunchParamsResponse | undefined;
};

export const UserParamsContext = createContext({} as TValue);

export const UserParamsProvider: FC<PropsWithChildren & TValue> = ({ children, launchParams }) => {
    const value: TValue = {
        launchParams,
    };

    return <UserParamsContext.Provider value={value}>{children}</UserParamsContext.Provider>;
};
