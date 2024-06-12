import { FC, useContext, useEffect, useState } from "react";
import styles from "./AlbumsList.module.scss";

import { CardGrid, ContentCard, Group, Header, Text } from "@vkontakte/vkui";
import { UserParamsContext } from "../../context/UserParamsContext.tsx";
import { EGetLaunchParamsResponsePlatforms } from "@vkontakte/vk-bridge";

type TProps = {
    albums: any;
    handleGetPhoto: (album: number) => void;
};

export const AlbumsList: FC<TProps> = ({ albums, handleGetPhoto }) => {
    const [platform, setPlatform] = useState<EGetLaunchParamsResponsePlatforms | null>(null);
    const { launchParams } = useContext(UserParamsContext);

    useEffect(() => {
        if (launchParams) {
            setPlatform(launchParams.vk_platform);
            console.log(launchParams.vk_platform);
        }
    }, [launchParams]);

    const albumsArr = albums.map((el: any) => {
        return (
            <ContentCard
                onClick={() => {
                    handleGetPhoto(el.id);
                }}
                src={el.sizes[el.sizes.length - 1].url}
                key={el.id}
                mode="shadow"
                subtitle={`${el.size} фото`}
                header={<Text>{el.title}</Text>}
                height={platform === "desktop_web" ? "200" : "250"}
            >
                <div className={styles.content}>
                    <div>{el.size} фото</div>
                </div>
            </ContentCard>
        );
    });

    return (
        <Group mode={"plain"} header={<Header mode="secondary">Альбомы</Header>}>
            <CardGrid size={platform === "desktop_web" ? "s" : "l"}>{albumsArr}</CardGrid>
        </Group>
    );
};
