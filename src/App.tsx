import {ReactNode, useEffect, useState} from 'react'
import vkBridge, {GetLaunchParamsResponse, UserInfo} from '@vkontakte/vk-bridge'
import {ScreenSpinner} from '@vkontakte/vkui'

import {Home} from './panels'
import {UserParamsProvider} from './context/UserParamsContext.tsx'
import {apiConfig} from './config/apiConfig.ts'

export const App = () => {
  const [fetchedUser, setFetchedUser] = useState<UserInfo & { token?: string } | undefined>()
  const [popout, setPopout] = useState<ReactNode | null>(<ScreenSpinner size="large" />)
  const [launchParams, setLaunchParams] = useState<GetLaunchParamsResponse>()

  const [userData, setUserData] = useState<{ userId: number, token: string } | null>(null)
  const [albums, setAlbums] = useState<any[]>([])
  const [photos, setPhotos] = useState<any[]>([])


  useEffect(() => {
    console.log('mount')

    async function fetchData() {
      const user = await vkBridge.send('VKWebAppGetUserInfo')
      console.log({user})

      setFetchedUser(user)
      setPopout(null)

      const fetchedToken = await vkBridge.send('VKWebAppGetAuthToken', {app_id: 51943569, scope: 'photos'})
      const fetchedParams = await vkBridge.send('VKWebAppGetLaunchParams')
      const fetchedAlbums = await vkBridge.send('VKWebAppCallAPIMethod', {
        method: 'photos.getAlbums',
        params: {
          owner_id: user.id,
          v: '5.131',
          access_token: fetchedToken.access_token,
          need_system: 1,
          need_covers: 1,
          photo_sizes: 1,
        },
      })

      setUserData({userId: user.id, token: fetchedToken.access_token})
      setLaunchParams(fetchedParams)
      setAlbums(fetchedAlbums.response.items)
    }

    fetchData().catch(console.log)

    vkBridge.subscribe((e) => {
      if (!e.detail) {
        return
      }

      if (e.detail.type === 'VKWebAppCallAPIMethodResult') {
        console.log(e.detail.data)
      }
    })
  }, [])

  const handleGetPhoto = async (id: number) => {
    if (!userData?.userId || !userData?.token) {
      return console.log('User data undefined')
    }

    const fetchedPhotos = await vkBridge.send('VKWebAppCallAPIMethod', {
      method: 'photos.get',
      params: {
        v: apiConfig.apiVersion,
        owner_id: userData?.userId,
        album_id: id,
        access_token: userData?.token,
        photo_sizes: 0,
        extended: 1,
        rev: 1,
        count: 1000,
      },
    })

    setPhotos(fetchedPhotos.response.items)
  }

  return (
    <UserParamsProvider launchParams={launchParams}>
      <Home fetchedUser={fetchedUser} userData={userData} albums={albums} photos={photos} handleGetPhoto={handleGetPhoto} popout={popout} />
    </UserParamsProvider>
  )
}
