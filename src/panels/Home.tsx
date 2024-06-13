import { FC, ReactNode, useState } from "react";
import {
    Avatar,
    Group,
    NavIdProps,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    SimpleCell,
    SplitCol,
    SplitLayout,
    usePlatform,
    View,
} from "@vkontakte/vkui";
import vkBridge, { UserInfo } from "@vkontakte/vk-bridge";
import { AlbumsList } from "../components/AlbumsList";
import { PhotoList } from "../components/PhotoList";
import { Album, Photo } from "../types/interfaces.ts";

interface IProps extends NavIdProps {
    fetchedUser?: UserInfo & { token?: string };
    userData: { userId: number; token: string } | null;
    albums: Album[];
    photos: Photo[];
    handleGetPhoto: (id: number) => Promise<void>;
    popout: ReactNode | null;
}

export const Home: FC<IProps> = ({ fetchedUser, userData, albums, photos, handleGetPhoto, popout }) => {
    const [activePanel, setActivePanel] = useState<string>("albumList");
    const [activeAlbum, setActiveAlbum] = useState<{ id: number; title?: string } | null>(null);
    const [targetAlbum, setTargetAlbum] = useState<{ id: number; title?: string } | null>(null);

    const platform = usePlatform();

    const { photo_200, city, first_name, last_name } = { ...fetchedUser };

    const handleMovePhoto = async (arg: { albumId: number; selectedPhotoIds: number[] }) => {
        if (!userData) {
            return console.log("User undefined");
        }

        if (!userData.token) {
            return console.log("User token undefined");
        }

        await Promise.all(
            arg.selectedPhotoIds.map(async id => {
                return await vkBridge.send("VKWebAppCallAPIMethod", {
                    method: "photos.move",
                    params: {
                        owner_id: userData.userId,
                        v: "5.131",
                        access_token: userData.token as string,
                        target_album_id: arg.albumId,
                        photo_id: id,
                    },
                });
            })
        )
            .then(() => {
                setTargetAlbum({ id: arg.albumId, title: albums.find(el => el.id === arg.albumId)?.title });
            })
            .finally(() => {
                activeAlbum && handleGetPhoto(activeAlbum.id);
            });
    };

    const goToAlbum = async (arg: { id: number; albumTitle?: string }) => {
        await handleGetPhoto(arg.id);
        setActiveAlbum(arg);
        setActivePanel("photoList");
        setTargetAlbum(null);
    };

    const albumOptions = albums.map(album => {
        return {
            label: album.title ?? "",
            value: album.id,
            avatar: album.sizes && album.sizes[0].url,
        };
    });

    return (
        <SplitLayout center popout={popout}>
            <SplitCol>
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
                        <AlbumsList albums={albums} goToAlbum={goToAlbum} />
                    </Panel>
                    <Panel id={`photoList`}>
                        <PanelHeader
                            before={
                                <PanelHeaderBack
                                    label={platform === "vkcom" ? "Назад" : undefined}
                                    onClick={() => {
                                        setActivePanel("albumList");
                                        setActiveAlbum(null);
                                        setTargetAlbum(null);
                                    }}
                                />
                            }
                        >
                            {platform !== "vkcom" ? "Альбомы" : null}
                        </PanelHeader>

                        {activeAlbum && (
                            <PhotoList
                                albumOptions={albumOptions}
                                activeAlbum={activeAlbum}
                                targetAlbum={targetAlbum}
                                handleReset={() => setTargetAlbum(null)}
                                photos={photos}
                                handleMovePhoto={handleMovePhoto}
                                goToAlbum={goToAlbum}
                            />
                        )}
                    </Panel>
                </View>
            </SplitCol>
        </SplitLayout>
    );
};
