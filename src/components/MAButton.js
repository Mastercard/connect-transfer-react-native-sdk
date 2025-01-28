import { Text, TouchableOpacity } from 'react-native';

import { MAButtonStyle as styles } from './ComponentStyles';

const MAButton = (props) => {
  const { text, onPress, style, textStyle } = props;

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default MAButton;
