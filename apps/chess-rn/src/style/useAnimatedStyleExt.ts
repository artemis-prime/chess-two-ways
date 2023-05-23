import  { 
  useAnimatedStyle, 
  type AnimateStyle,
  type SharedValue,
 } from 'react-native-reanimated'

// 'updater' must be a 'worklet' since it will be called from the
// UI thread.
const useAnimatedStyleExt: <V, S>(
  v: SharedValue<V>,
  updater: (val: SharedValue<V>, ...args: any[]) => AnimateStyle<S>,
  args?: any[],
) => AnimateStyle<S> 
  = (v, updater, args) => (useAnimatedStyle(() =>  (updater(v, ...(args ?? []))), args))

export default useAnimatedStyleExt
