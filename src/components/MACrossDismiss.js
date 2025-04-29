import { TouchableOpacity, Image } from 'react-native';

import Cross from '../assets/cross.png';
import { MACrossDismissStyle as styles } from './ComponentStyles';

const MACrossDismiss = ({ style = {}, onCrossPress = () => {} }) => {
  return (
    <TouchableOpacity onPress={onCrossPress} style={[styles.crossIcon, style]}>
      <Image source={Cross} resizeMode="contain" />
    </TouchableOpacity>
  );
};

export default MACrossDismiss;
