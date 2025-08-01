/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ImageSource } from './@types'
import ImageDefaultHeader from './components/ImageDefaultHeader'
import ImageItem from './components/ImageItem/ImageItem'
import StatusBarManager from './components/StatusBarManager'
import useAnimatedComponents from './hooks/useAnimatedComponents'
import useImageIndexChange from './hooks/useImageIndexChange'
import useRequestClose from './hooks/useRequestClose'
import React, {
  ComponentType,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from 'react'
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  VirtualizedList,
  ModalProps,
  Modal,
} from 'react-native'

type Props = {
  images: ImageSource[]
  keyExtractor?: (imageSrc: ImageSource, index: number) => string
  imageIndex: number
  visible: boolean
  onRequestClose: () => void
  onLongPress?: (image: ImageSource) => void
  onImageIndexChange?: (imageIndex: number) => void
  presentationStyle?: ModalProps['presentationStyle']
  animationType?: ModalProps['animationType']
  backgroundColor?: string
  swipeToCloseEnabled?: boolean
  doubleTapToZoomEnabled?: boolean
  delayLongPress?: number
  HeaderComponent?: ComponentType<{ imageIndex: number }>
  FooterComponent?: ComponentType<{ imageIndex: number }>
  middleComponent?: ReactNode
}

const DEFAULT_ANIMATION_TYPE = 'fade'
const DEFAULT_BG_COLOR = '#000'
const DEFAULT_DELAY_LONG_PRESS = 800
const SCREEN = Dimensions.get('screen')
const SCREEN_WIDTH = SCREEN.width

function ImageViewing({
  images,
  keyExtractor,
  imageIndex,
  visible,
  onRequestClose,
  onLongPress = () => {},
  onImageIndexChange,
  animationType = DEFAULT_ANIMATION_TYPE,
  backgroundColor = DEFAULT_BG_COLOR,
  presentationStyle,
  swipeToCloseEnabled,
  doubleTapToZoomEnabled,
  delayLongPress = DEFAULT_DELAY_LONG_PRESS,
  HeaderComponent,
  FooterComponent,
  middleComponent,
}: Props) {
  const imageList = useRef<VirtualizedList<ImageSource>>(null)
  const [opacity, onRequestCloseEnhanced] = useRequestClose(onRequestClose)
  const [currentImageIndex, onScroll] = useImageIndexChange(imageIndex, SCREEN)
  const [headerTransform, footerTransform, toggleBarsVisible] =
    useAnimatedComponents()

  useEffect(() => {
    if (onImageIndexChange) {
      onImageIndexChange(currentImageIndex)
    }
  }, [currentImageIndex])

  const onZoom = useCallback(
    (isScaled: boolean) => {
      // @ts-ignore
      imageList?.current?.setNativeProps({ scrollEnabled: !isScaled })
      toggleBarsVisible(!isScaled)
    },
    [imageList]
  )

  if (!visible) {
    return null
  }

  return (
    <Modal
      transparent={presentationStyle === 'overFullScreen'}
      visible={visible}
      presentationStyle={presentationStyle}
      animationType={animationType}
      onRequestClose={onRequestCloseEnhanced}
      supportedOrientations={['portrait']}
      hardwareAccelerated
    >
      <StatusBarManager presentationStyle={presentationStyle} />
      <View style={[styles.container, { opacity, backgroundColor }]}>
        <Animated.View style={[styles.header, { transform: headerTransform }]}>
          {typeof HeaderComponent !== 'undefined' ? (
            React.createElement(HeaderComponent, {
              imageIndex: currentImageIndex,
            })
          ) : (
            <ImageDefaultHeader onRequestClose={onRequestCloseEnhanced} />
          )}
        </Animated.View>

        {middleComponent ? (
          <View style={styles.middleContent}>{middleComponent}</View>
        ) : null}

        <VirtualizedList
          ref={imageList}
          data={images}
          horizontal
          pagingEnabled
          windowSize={2}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          initialScrollIndex={imageIndex}
          getItem={(_: any, index: any) => images[index]}
          getItemCount={() => images.length}
          getItemLayout={(_: any, index: any) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          renderItem={({ item: imageSrc }: any) => (
            <ImageItem
              onZoom={onZoom}
              imageSrc={imageSrc}
              onRequestClose={onRequestCloseEnhanced}
              onLongPress={onLongPress}
              delayLongPress={delayLongPress}
              swipeToCloseEnabled={swipeToCloseEnabled}
              doubleTapToZoomEnabled={doubleTapToZoomEnabled}
            />
          )}
          onMomentumScrollEnd={onScroll}
          //@ts-ignore
          keyExtractor={(imageSrc, index) =>
            keyExtractor
              ? keyExtractor(imageSrc, index)
              : typeof imageSrc === 'number'
              ? `${imageSrc}`
              : imageSrc.uri
          }
        />
        {}

        {typeof FooterComponent !== 'undefined' && (
          <Animated.View
            style={[styles.footer, { transform: footerTransform }]}
          >
            {React.createElement(FooterComponent, {
              imageIndex: currentImageIndex,
            })}
          </Animated.View>
        )}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  middleContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex:1
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    top: 0,
  },
  footer: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    bottom: 0,
  },
})

const EnhancedImageViewing = (props: Props) => (
  <ImageViewing key={props.imageIndex} {...props} />
)

export default EnhancedImageViewing
