import { Platform, Linking } from 'react-native';
const RedirectToMap = async(label) => {
  console.log('ffvfv');

  const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
  // const label = 'Custom Label';
  const url = Platform.select({
    ios: `${scheme}${label}`,
    android: `${scheme}${label}`
  });
  if (Platform.OS ==='ios') {
    const supported = await Linking.canOpenURL(url); //To check if URL is supported or not.
    if (supported) {
    await Linking.openURL(url); // It will open the URL on browser.
    } else {
    alert(`Don't know how to open this URL: ${url}`);
    }
  } else {
    Linking.openURL(url);
  }
}
export default RedirectToMap