import { FC, ReactNode, useState } from "react";
import {
    Avatar,
    Group,
    NavIdProps,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    SimpleCell,
    usePlatform,
    View,
} from "@vkontakte/vkui";
import vkBridge, { UserInfo } from "@vkontakte/vk-bridge";
import { AlbumsList } from "../components/AlbumsList/AlbumsList.tsx";
import { PhotoList } from "../components/PhotoList/PhotoList.tsx";

export interface HomeProps extends NavIdProps {
    fetchedUser?: UserInfo & { token?: string };
    userData: { userId: number; token: string } | null;
    albums: any[];
    photos: any[];
    handleGetPhoto: (id: number) => Promise<void>;
    popout: ReactNode | null;
}

export const Home: FC<HomeProps> = ({ fetchedUser, userData, albums, photos, handleGetPhoto }) => {
    const [activePanel, setActivePanel] = useState<string>("albumList");
    const [activeAlbumId, setActiveAlbumId] = useState<number | null>(null);

    const platform = usePlatform();

    const { photo_200, city, first_name, last_name } = { ...fetchedUser };

    const handleMovePhoto = async (arg: { albumId: number; selectedPhotoIds: string[] }) => {
        console.log({ userData });
        if (!userData) {
            return console.log("User undefined");
        }

        if (!userData.token) {
            return console.log("User token undefined");
        }

        console.log(arg);
        const fetchedMove = Promise.all(
            arg.selectedPhotoIds.map(id => {
                return vkBridge
                    .send("VKWebAppCallAPIMethod", {
                        method: "photos.move",
                        params: {
                            owner_id: userData.userId,
                            v: "5.131",
                            access_token: userData.token as string,
                            target_album_id: arg.albumId,
                            photo_id: id,
                        },
                    })
                    .finally(() => activeAlbumId && handleGetPhoto(activeAlbumId));
            })
        );

        console.log({ fetchedMove });
    };

    const albumOptions = albums.map(album => {
        return {
            label: album.title,
            value: album.id,
            avatar: album.sizes[0].url,
        };
    });

    return (
        <>
            {platform === "vkcom" && fetchedUser && (
                <Group>
                    <SimpleCell
                        before={photo_200 && <Avatar src={photo_200} />}
                        subtitle={city?.title}
                        expandable="auto"
                    >
                        {`${first_name} ${last_name}`}
                    </SimpleCell>
                </Group>
            )}

            <View activePanel={activePanel}>
                <Panel mode={"plain"} id={"albumList"}>
                    <AlbumsList
                        albums={albums}
                        handleGetPhoto={async id => {
                            await handleGetPhoto(id);
                            setActiveAlbumId(id);
                            setActivePanel("photoList");
                        }}
                    />
                </Panel>
                <Panel id={`photoList`}>
                    <PanelHeader
                        before={
                            <PanelHeaderBack
                                label={platform === "vkcom" ? "Назад" : undefined}
                                onClick={() => {
                                    setActivePanel("albumList");
                                    setActiveAlbumId(null);
                                }}
                            />
                        }
                    >
                        Альбомы
                    </PanelHeader>
                    <PhotoList albumOptions={albumOptions} photos={photos} handleMovePhoto={handleMovePhoto} />
                </Panel>
            </View>
        </>
    );
};
