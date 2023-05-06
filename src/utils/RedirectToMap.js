import { Platform, Linking } from 'react-native';
import { socketUrl } from './api';
const RedirectToMap = async(str) => {

  const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
  const label = str.split(" ").join("+")

  console.log(label);

  const url = Platform.select({
    ios: `${scheme}${label}`,
    android: `${scheme}${label}`
  });
  console.log(url);
  if (Platform.OS ==='ios') {
    const supported = await Linking.canOpenURL(url); //To check if URL is supported or not.
    if (supported) {
    await Linking.openURL(url); // It will open the URL on browser.
    } else {
      console.log(`Dont know how to open this URL: ${url}`);
    alert(`Don't know how to open this URL: ${url}`);
    }
  } else {
    Linking.openURL(url);
  }
}
export default RedirectToMap