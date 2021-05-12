# Formated-Text-View
Based on [react-native-twitter-textview](https://github.com/cawfree/react-native-twitter-textview)

We have modified it for our own use case

Download the file and put it in /src folder

### Why use FormatedTextView
* Uses only react-native
* Doesn't interfere with your existing text styling
* Gives an alert, asking if the users want to open the link
* Supports dark mode

## Useage
```js
<Text style={styles.body}>
  <FormatedTextView body={'text'} isDarkMode={true} />
 </Text>
```
