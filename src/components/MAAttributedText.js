import { Text, Pressable, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';

const MAAttributedText = ({ text, styledTexts, textStyle, component = null }) => {
  const { t } = useTranslation();

  const pattern =
    styledTexts?.length > 0
      ? new RegExp(`(${styledTexts.map(item => item.text).join('|')})`, 'gi')
      : null;

  const parts = pattern ? text?.split(pattern) : [text];

  return (
    <>
      <Text style={textStyle}>
        {parts.map((part, index) => {
          const styledObj = styledTexts?.find(
            item => item.text?.toLowerCase() === part.toLowerCase()
          );
          const key = `${part}-${index}`;

          if (!styledObj) {
            return (
              <Text key={key} style={textStyle}>
                {part}
              </Text>
            );
          }

          const styledText = styledObj.onPress ? (
            <Pressable key={key} onPress={styledObj.onPress}>
              <Text style={styledObj.style}>{part}</Text>
            </Pressable>
          ) : (
            <Text key={key} style={styledObj.style}>
              {part}
            </Text>
          );

          if (styledObj.text === t('LandingPage.PrivacyNotice') && component) {
            return (
              <Pressable
                key={key}
                onPress={styledObj.onPress}
                style={{
                  flexDirection: 'row',
                  transform: [{ translateY: Platform.OS === 'ios' ? 1 : 4 }]
                }}
              >
                <Text style={[styledObj.style]}>{part}</Text>
                <Text style={{ textDecorationLine: 'none' }}> </Text>
                {component}
              </Pressable>
            );
          }

          return styledText;
        })}
      </Text>
    </>
  );
};

export default MAAttributedText;
