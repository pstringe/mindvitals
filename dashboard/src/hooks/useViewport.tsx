import { createContext, useContext, useEffect, useState } from 'react'

const viewportContext = createContext({
  width: 0,
  height: 0,
})

export const ViewportProvider = ({
  children,
}: {
  children: React.ReactNode | React.ReactNodeArray
}) => {
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)

  const handleWindowResize = () => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  return (
    <viewportContext.Provider value={{ width, height }}>
      {children}
    </viewportContext.Provider>
  )
}

const responsive = {
  desktop: {
    max: 3000,
    min: 1024,
  },
  tablet: {
    max: 1024,
    min: 468,
  },
  mobile: {
    max: 468,
    min: 0,
  },
}

export const useViewport = () => {
  const { width, height } = useContext(viewportContext)
  const getDeviceType = (width: number) => {
    if (width >= responsive.desktop.min) return 'desktop'
    if (width >= responsive.tablet.min) return 'tablet'
    return 'mobile'
  }

  return {
    width,
    height,
    isMobile: width <= responsive.mobile.max,
    deviceType: getDeviceType(width),
  }
}
