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
import { Photo } from "../../types/interfaces.ts";

type TProps = {
    photos: Photo[];
    albumOptions: {
        label: string;
        value: number;
        avatar?: string;
    }[];
    activeAlbum: { id: number; title?: string };
    targetAlbum: { id: number; title?: string } | null;
    handleMovePhoto: (arg: { albumId: number; selectedPhotoIds: number[] }) => Promise<void>;
    handleReset: () => void;
    goToAlbum: (album: { id: number; title?: string }) => void;
};

export const PhotoList: FC<TProps> = ({
    photos,
    albumOptions,
    activeAlbum,
    targetAlbum,
    handleMovePhoto,
    handleReset,
    goToAlbum,
}) => {
    const [platform, setPlatform] = useState<EGetLaunchParamsResponsePlatforms | null>(null);
    const [selectedPhotoId, setSelectedPhotoId] = useState<number[]>([]);
    const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);

    const { launchParams } = useContext(UserParamsContext);

    useEffect(() => {
        if (launchParams) {
            setPlatform(launchParams.vk_platform);
        }
    }, [launchParams]);

    const handleSelectPhotoId = (id: number) => {
        setSelectedPhotoId(prev => [...prev, id]);
        handleReset();
    };

    const handleUnselectPhotoId = (id: number) => {
        setSelectedPhotoId(prev => [...prev].filter(prevId => prevId !== id));
    };

    const handleSelectAlbumId = (id: number) => {
        setSelectedAlbumId(id);
        handleReset();
    };

    const photoArr = photos.map((el: Photo) => {
        const activated = selectedPhotoId.includes(el.id);
        return (
            <ContentCard
                getRootRef={ref => {
                    if (activated) {
                        ref?.style.setProperty("opacity", "0.5");
                    } else {
                        ref?.style.setProperty("opacity", "1");
                    }
                }}
                activated={activated}
                hasActive={true}
                activeMode={"opacity"}
                activeEffectDelay={1}
                onClick={() => {
                    if (!activated) {
                        return handleSelectPhotoId(el.id);
                    }

                    handleUnselectPhotoId(el.id);
                }}
                header={""}
                src={el.sizes && el.sizes[el.sizes.length - 1].url}
                key={el.id}
                mode="shadow"
                subtitle={el.date ? <div>{dayjs.unix(el.date).format("DD MMMM YYYY")}</div> : null}
                height={platform === "desktop_web" ? "200" : "250"}
                text={
                    <div className={styles.likesWrapper}>
                        <div className={styles.likesImg}></div>
                        <Text style={{ lineHeight: "20px" }} weight={"2"}>
                            {el.likes?.count}
                        </Text>
                    </div>
                }
            ></ContentCard>
        );
    });

    return (
        <>
            <Group mode={"plain"} style={{ marginLeft: "5px", marginRight: "5px" }}>
                <Select
                    id="select-id"
                    placeholder="Альбом не выбран"
                    options={albumOptions.filter(options => options.value !== activeAlbum.id)}
                    renderOption={({ option, ...restProps }) => (
                        <CustomSelectOption
                            {...restProps}
                            key={option.value}
                            before={<Avatar size={24} src={option.avatar} />}
                        />
                    )}
                    onChange={e => {
                        handleSelectAlbumId(Number(e.target.value));
                    }}
                />

                <div className={styles.moveBtnWrapper}>
                    <div className={styles.targetAlbumText}>
                        {targetAlbum?.title ? (
                            <Text weight={"2"}>
                                Перенесено в:{" "}
                                <span
                                    className={styles.targetAlbumName}
                                    onClick={() => {
                                        goToAlbum({ id: targetAlbum.id, title: targetAlbum?.title });
                                    }}
                                >
                                    {targetAlbum?.title}
                                </span>
                            </Text>
                        ) : null}
                    </div>
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
            <Group mode={"plain"} header={<Header mode="secondary">{activeAlbum.title}</Header>}>
                <CardGrid size={platform === "desktop_web" ? "s" : "l"}>{photoArr}</CardGrid>
            </Group>
        </>
    );
};
