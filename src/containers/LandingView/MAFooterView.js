import { Image, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import MASecuredBy from '../../components/MASecuredBy';
import MAButton from '../../components/MAButton';
import LinkIcon from '../../assets/linkIcon.png';
import MAAttributedText from '../../components/MAAttributedText';
import { MAFooterViewStyle as styles } from './MALandingViewStyles';
import { getURL, openLink } from '../../utility/utils';

const MAFooterView = ({ onNextPress }) => {
  const { t } = useTranslation();

  const language = useSelector(state => state.user.language);

  const STYLED_TEXT = [
    {
      text: t('NextText'),
      style: styles.footerHighlight
    },
    {
      text: t('TermsAndConditionsText'),
      style: styles.footerLink,
      onPress: () => openLink(getURL(language, 'termsOfUse'))
    },
    {
      text: t('PrivacyNoticeText'),
      style: styles.footerLink,
      onPress: () => openLink(getURL(language, 'privacy'))
    }
  ];

  return (
    <View style={styles.footerContainer}>
      <MAAttributedText
        text={`${t('LandingPageTermsAndConditionsInfoText')} `}
        textStyle={styles.footerText}
        styledTexts={STYLED_TEXT}
        component={<Image source={LinkIcon} style={styles.linkIcon} testID="link-icon" />}
      />
      <MAButton
        text={t('NextText')}
        style={styles.button}
        onPress={onNextPress}
        testID="next-button"
      />
      <MASecuredBy />
    </View>
  );
};

export default MAFooterView;
