import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import DATA, {bgs} from './json/Data';

const {width, height} = Dimensions.get('screen');
// const bgs = ['#A5BBFF', '#DDBEFE', '#FF63ED', '#B98EFF'];

export default function App() {
  const scollX = useRef(new Animated.Value(0)).current;

  const BackDrop = ({scollX}) => {
    const bg = scollX.interpolate({
      inputRange: bgs.map((_, index) => index * width),
      outputRange: bgs.map(bg => bg),
    });
    return (
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: bg,
          },
        ]}
      />
    );
  };

  const DotAnimated = ({scollX}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingBottom: 100,
        }}>
        {DATA.map((_, i) => {
          const scale = scollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [0.9, 1.5, 0.9],
            extrapolate: 'clamp',
          });
          const opacity = scollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [0.4, 1.5, 0.4],
            extrapolate: 'clamp',
          });
          return (
            <TouchableOpacity onPress={() => console.log(i)}>
              <Animated.View
                style={{
                  marginLeft: 20,
                  width: 30,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: '#fff',
                  transform: [{scale}],
                  opacity,
                }}></Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  const flatlistRef = useRef(null);
  const [cout, setCout] = React.useState(1);
  useEffect(() => {
    const a = setTimeout(() => {
      flatlistRef.current.scrollToIndex({
        index: cout,
      });
      if (cout === 3) {
        clearTimeout(a);
      } else {
        setCout(cout + 1);
      }
    }, 2000);
  }, [cout]);

  return (
    <View style={styles.component}>
      <BackDrop scollX={scollX} />
      <Animated.FlatList
        data={DATA}
        ref={flatlistRef}
        keyExtractor={item => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scollX}}}],
          {useNativeDriver: false},
        )}
        renderItem={({item}) => {
          return (
            <View
              style={{width, justifyContent: 'center', alignItems: 'center'}}>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  resizeMode: 'cover',
                }}
                source={{
                  uri: item.image,
                }}
              />
            </View>
          );
        }}
      />
      <DotAnimated scollX={scollX} />
    </View>
  );
}

const styles = StyleSheet.create({
  component: {
    flex: 1,
    alignItems: 'center',
  },
});
