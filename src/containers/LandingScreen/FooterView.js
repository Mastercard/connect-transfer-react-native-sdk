import { Image, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import SecuredBy from '../../components/SecuredBy';
import MAButton from '../../components/MAButton';
import LinkIcon from '../../assets/linkIcon.png';
import MAAttributedText from '../../components/MAAttributedText';
import { LandingScreenFooterStyle as styles } from './LandingScreenStyles';
import { getURL, openLink } from '../../utility/utils';

const FooterView = ({ onNextPress }) => {
  const { t } = useTranslation();

  const language = useSelector(state => state.user.language);

  return (
    <View style={styles.footerContainer}>
      <MAAttributedText
        text={`${t('LandingPageTermsAndConditionsInfoText')} `}
        textStyle={styles.footerText}
        styledTexts={[
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
        ]}
        component={<Image source={LinkIcon} style={styles.linkIcon} />}
      />
      <MAButton text={t('NextText')} style={styles.button} onPress={onNextPress} />
      <SecuredBy />
    </View>
  );
};

export default FooterView;
