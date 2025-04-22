import { Text, TouchableOpacity } from 'react-native';

import { MAButtonStyle as styles } from './ComponentStyles';

const MAButton = props => {
  const { text, onPress, style, textStyle, testID } = props;

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      activeOpacity={0.7}
      onPress={onPress}
      testID={testID}
    >
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default MAButton;
