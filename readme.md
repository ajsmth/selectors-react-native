# selectors-react-native

the goal of this library is to provide a more declarative API for applying styles based on dynamic / changing values, since react native does not have the convienience of media selectors.

these dynamic values include:

- color scheme
- accessibility settings
- device orientation
- platforms (ios / android / web)
- screen width (in the near future)

### install

```bash
yarn add selectors-react-native
```

### example

```jsx
import { useSelectorStyle } from "selectors-react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
  },

  angryBackground: {
    backgroundColor: "red",
  },

  dimmedBackground: {
    backgroundColor: "gray",
  },
});

function MyScreen({}) {
  const selectorStyles = useSelectorStyle({
    portrait: styles.angryBackground,
    ["reduce-motion"]: styles.dimmedBackground,
  });

  return <View style={[styles.container, selectorStyles]} />;
}
```
