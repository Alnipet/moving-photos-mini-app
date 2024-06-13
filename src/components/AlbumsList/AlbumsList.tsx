import { FC, useContext, useEffect, useState } from "react";
import styles from "./AlbumsList.module.scss";

import { CardGrid, ContentCard, Group, Header, Text } from "@vkontakte/vkui";
import { UserParamsContext } from "../../context/UserParamsContext.tsx";
import { EGetLaunchParamsResponsePlatforms } from "@vkontakte/vk-bridge";
import { Album } from "../../types/interfaces.ts";

type TProps = {
    albums: Album[];
    goToAlbum: (album: { id: number; title?: string }) => void;
};

export const AlbumsList: FC<TProps> = ({ albums, goToAlbum }) => {
    const [platform, setPlatform] = useState<EGetLaunchParamsResponsePlatforms | null>(null);
    const { launchParams } = useContext(UserParamsContext);

    useEffect(() => {
        if (launchParams) {
            setPlatform(launchParams.vk_platform);
        }
    }, [launchParams]);

    const albumsArr = albums.map((el: Album) => {
        return (
            <ContentCard
                onClick={() => {
                    goToAlbum({ id: el.id, title: el?.title });
                }}
                src={el.sizes && el.sizes[el.sizes.length - 1].url}
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
