import { Text, TouchableOpacity } from 'react-native';

const MAAttributedText = ({ text, styledTexts, textStyle, component = null }) => {
  const pattern =
    styledTexts?.length > 0
      ? new RegExp(`(${styledTexts.map(item => item.text).join('|')})`, 'gi')
      : null;

  const parts = pattern ? text?.split(pattern) : [text];

  return (
    <>
      <Text style={textStyle}>
        {parts.map((part, index) => {
          const styledTextObj = styledTexts?.find(
            item => item.text?.toLowerCase() === part.toLowerCase()
          );

          if (styledTextObj) {
            const key = `${styledTextObj.text}-${index}`;
            if (styledTextObj.onPress) {
              return (
                <TouchableOpacity key={key} onPress={styledTextObj.onPress} activeOpacity={0.7}>
                  <Text style={styledTextObj.style}>{part}</Text>
                </TouchableOpacity>
              );
            } else {
              return (
                <Text key={key} style={styledTextObj.style}>
                  {part}
                </Text>
              );
            }
          }
          return part;
        })}
        {component}
      </Text>
    </>
  );
};

export default MAAttributedText;
