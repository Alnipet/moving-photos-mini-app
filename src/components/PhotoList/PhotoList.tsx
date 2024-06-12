import { FC, useContext, useEffect, useState } from "react";
import styles from "./PhotoList.module.scss";

import {
    Avatar,
    Button,
    CardGrid,
    ContentCard,
    CustomSelectOption,
    Group,
    Header,
    Select,
    Text,
} from "@vkontakte/vkui";
import { UserParamsContext } from "../../context/UserParamsContext.tsx";
import { EGetLaunchParamsResponsePlatforms } from "@vkontakte/vk-bridge";
import dayjs from "dayjs";

type TProps = {
    photos: any;
    albumOptions: {
        label: string;
        value: number;
        avatar: string;
    }[];
    handleMovePhoto: (arg: { albumId: number; selectedPhotoIds: string[] }) => Promise<void>;
};

export const PhotoList: FC<TProps> = ({ photos, albumOptions, handleMovePhoto }) => {
    const [platform, setPlatform] = useState<EGetLaunchParamsResponsePlatforms | null>(null);
    const [selectedPhotoId, setSelectedPhotoId] = useState<string[]>([]);
    const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);

    const { launchParams } = useContext(UserParamsContext);

    useEffect(() => {
        if (launchParams) {
            setPlatform(launchParams.vk_platform);
            console.log(launchParams.vk_platform);
        }
    }, [launchParams]);

    const handleSelectPhotoId = (id: string) => {
        setSelectedPhotoId(prev => [...prev, id]);
    };

    const handleUnselectPhotoId = (id: string) => {
        setSelectedPhotoId(prev => [...prev].filter(prevId => prevId !== id));
    };

    const handleSelectAlbumId = (id: number) => {
        setSelectedAlbumId(id);
    };

    const photoArr = photos.map((el: any) => {
        const activated = selectedPhotoId.includes(el.id);
        return (
            <ContentCard
                activated={activated}
                hasActive={true}
                activeMode={"opacity"}
                activeEffectDelay={1}
                onClick={() => {
                    console.log(el.id);
                    if (!activated) {
                        return handleSelectPhotoId(el.id);
                    }

                    handleUnselectPhotoId(el.id);
                }}
                header={<div>{dayjs.unix(el.date).format("DD MMMM YYYY")}</div>}
                activeClassName={styles.photoItemWrapper}
                src={el.sizes[el.sizes.length - 1].url}
                key={el.id}
                mode="shadow"
                subtitle={`${el.id} фото`}
                height={platform === "desktop_web" ? "200" : "250"}
                text={`likes: ${el.likes?.count}`}
            ></ContentCard>
        );
    });

    return (
        <>
            <Group mode="card">
                <Select
                    id="select-id"
                    placeholder="Альбом не выбран"
                    options={albumOptions}
                    renderOption={({ option, ...restProps }) => (
                        <CustomSelectOption
                            {...restProps}
                            key={option.value}
                            before={<Avatar size={24} src={option.avatar} />}
                        />
                    )}
                    onChange={e => {
                        console.log({ select: e.target.value });
                        handleSelectAlbumId(Number(e.target.value));
                    }}
                />

                <div className={styles.moveBtnWrapper}>
                    {selectedPhotoId.length ? <Text weight={"2"}>Выбрано: {selectedPhotoId.length}</Text> : null}
                    <Button
                        style={{ marginLeft: 15 }}
                        size={"m"}
                        disabled={!selectedAlbumId || !selectedPhotoId.length}
                        onClick={() => {
                            if (!selectedAlbumId) return;
                            handleMovePhoto({ albumId: selectedAlbumId, selectedPhotoIds: selectedPhotoId }).then(
                                () => {
                                    setSelectedPhotoId([]);
                                }
                            );
                        }}
                    >
                        Перенести фото
                    </Button>
                </div>
            </Group>
            <Group mode={"plain"} header={<Header mode="secondary">Фотографии</Header>}>
                <CardGrid size={platform === "desktop_web" ? "s" : "l"}>{photoArr}</CardGrid>
            </Group>
        </>
    );
};

PhotoList.propTypes = {};
