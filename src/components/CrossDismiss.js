import { TouchableOpacity, Image } from 'react-native';

import Cross from '../assets/cross.png';
import { CrossDismissStyle as styles } from './ComponentStyles';

const CrossDismiss = ({ style = {}, onCrossPress = () => {} }) => {
  return (
    <TouchableOpacity onPress={onCrossPress} style={[styles.crossIcon, style]}>
      <Image source={Cross} resizeMode="contain" />
    </TouchableOpacity>
  );
};

export default CrossDismiss;
