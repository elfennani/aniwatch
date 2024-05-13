import { useEffect, useState } from "react"
import { VolumeManager } from 'react-native-volume-manager';

const useVolume = () => {
  const [volume, setVolume] = useState(0)

  useEffect(() => {
    VolumeManager.getVolume().then((val) => setVolume(val.volume * 100))

    const volumeListener = VolumeManager.addVolumeListener((result) => {
      setVolume(result.volume * 100);
    });

    return () => volumeListener.remove()
  }, [])

  const changeVolume = (callback: ((value: number) => number)) => {
    const value = callback(volume)
    VolumeManager.setVolume(value / 100)
    setVolume(value)
  }

  return [volume, changeVolume] as const
}

export default useVolume 