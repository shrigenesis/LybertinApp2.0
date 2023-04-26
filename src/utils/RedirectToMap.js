import { Platform, Linking } from 'react-native';
const RedirectToMap = (label) => {
  const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
  // const label = 'Custom Label';
  const url = Platform.select({
    ios: `${scheme}${label}`,
    android: `${scheme}${label}`
  });

  Linking.openURL(url);

}
export default RedirectToMap