import React from "react";
import PropTypes from "prop-types";
import { Linking, Text, StyleSheet, Alert } from "react-native";

const styles = StyleSheet.create({
  linkStyle: {
    color: "#38b0ff"
  }
});

 
const PATTERN_URL = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

const matchesWith = (str, pattern) => {
  let match = null;
  const arr = [];
  while ((match = pattern.exec(str)) != null) {
    arr.push([match, pattern]);
  }
  return arr;
};

const splitStringByMatches = (str, matches) => {
  const arr = [];
  let o = 0;

  matches.forEach(([match, pattern]) => {
    const { index } = { ...match };
    const text = match[match.length - 1];
    arr.push([str.slice(o, index), null]);
    arr.push([str.slice(index, index + text.length + 1), pattern]);
    o = index + text.length + 1;
  });

  arr.push([str.slice(o, str.length), null]);

  return arr.filter(([s]) => s.length > 0);
};

const TwitterTextView = ({
  children = "",
  extractLinks,
  onPressLink,
  linkStyle,
  ...extraProps
}) => {
  const str = (typeof children === "string" && children) || "";

  const patterns = [
    !!extractLinks && PATTERN_URL
  ].filter(e => !!e);

  const matches = []
    .concat(...patterns.map(pattern => matchesWith(str, pattern)))
    .filter(e => !!e)
    .sort(([a], [b]) => ({ ...a }.index - { ...b }.index));

  const onPress = {
    [PATTERN_URL]: onPressLink
  };
  const style = {
    [PATTERN_URL]: linkStyle
  };

  return (
    <Text {...extraProps}>
      {splitStringByMatches(str, matches).map(([str, pattern], i) => {
        
        if (pattern == PATTERN_URL) {
          return (
            <Text
              key={i}
              style={style[pattern]}
              children={str}
              onPress={() => {
                Alert.alert("Are you sure that you want to open this link", str,
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Open",
                      style: "default",
                      onPress: () => { Linking.canOpenURL(str).then(canOpen => {
                        if (canOpen) { Linking.openURL(str) }
                      })}
                    }
                  ]
                )
              }}
            />
          );
        } else {
          return (
            <Text
              key={i}
              style={style[pattern]}
              children={str}
            />
          );
        }
      })}
    </Text>
  );
};

const textStyleProps = PropTypes.oneOfType([
  PropTypes.shape({}),
  PropTypes.number
]);

TwitterTextView.propTypes = {
  children: PropTypes.string,
  extractLinks: PropTypes.bool,
  onPressLink: PropTypes.func,
  linkStyle: textStyleProps
};

TwitterTextView.defaultProps = {
  children: "",
  extractLinks: true,
  linkStyle: styles.linkStyle,
};


export const FormatedTextView = ({ body, isDarkMode }) => {
  return (
    <TwitterTextView
      style={{
        color: isDarkMode ? 'white' : 'black'
      }}
      linkStyle={{
        color: '#38b0ff'
      }}
    >
      {body}
    </TwitterTextView>
  )
}