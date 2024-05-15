import { useEffect, useState } from "react"
import * as Brightness from 'expo-brightness';

const useBrightness = () => {
  const [brightness, setBrightness] = useState(0)

  useEffect(() => {
    Brightness.getBrightnessAsync().then((val) => setBrightness(val * 100))

    const listener = Brightness.addBrightnessListener((result) => {
      setBrightness(result.brightness * 100)
    });

    return () => listener.remove()
  }, [])

  const changeBrightness = (callback: ((value: number) => number)) => {
    const value = callback(brightness)
    Brightness.setBrightnessAsync(value / 100).catch(console.error)
    setBrightness(value)
  }

  return [brightness, changeBrightness] as const
}

export default useBrightness 