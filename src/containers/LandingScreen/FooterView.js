import { Image, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import SecuredBy from '../../components/SecuredBy';
import MAButton from '../../components/MAButton';
import LinkIcon from '../../assets/linkIcon.png';
import ErrorScreenState from '../ErrorScreen';
import MAAttributedText from '../../components/MAAttributedText';
import { LandingScreenFooterStyle as styles } from './Styles';
import { getURL, openLink } from '../../utility/utils';

const FooterView = ({ navigation }) => {
  const { t } = useTranslation();

  const language = useSelector(state => state.user.language);
  const onCloseOfErrorScreen = () => {
    console.log('Close pressed from error screen');
  };

  const onTryAgainOfErrorScreen = () => {
    console.log('Try again pressed from error screen');
  };

  const onReturnToPartnerOfErrorScreen = () => {
    console.log('Return to partner pressed from error screen');
  };

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
      <MAButton
        text={t('NextText')}
        style={styles.button}
        onPress={() =>
          navigation.navigate('Error', {
            partnerName: 'Finicity',
            errorScreenState: 0,
            onClose: onCloseOfErrorScreen,
            onTryAgain: onTryAgainOfErrorScreen,
            onReturnToPartner: onReturnToPartnerOfErrorScreen
          })
        }
      />
      <SecuredBy />
    </View>
  );
};

export default FooterView;
