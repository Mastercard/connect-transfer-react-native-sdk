import { ScrollView, Text, View, Image } from 'react-native';
import { useTranslation } from 'react-i18next';

import MAAttributedText from '../../components/MAAttributedText';
import { MAScrollableViewStyle as styles } from './MALandingViewStyles';
import Lock from '../../assets/lock.png';

const MAScrollableView = () => {
  const { t } = useTranslation();

  const STEPS = [
    { number: '1', text: t('LandingPageInstructionFirstStepText') },
    { number: '2', text: t('LandingPageInstructionSecondStepText') },
    { number: '3', text: t('LandingPageInstructionThirdStepText') }
  ];

  const STYLED_TEXT = [
    {
      text: t('FinicityMastercardCompanyText'),
      style: styles.boldText
    },
    {
      text: t('Atomic'),
      style: styles.boldText
    }
  ];

  const stepsSection = () => (
    <View style={styles.stepsContainer}>
      <Text style={styles.headerText}>{`${t('LandingPageStepInstructionText')}:`}</Text>
      {STEPS.map(step => (
        <View key={step.number} style={styles.stepItem}>
          <Text style={styles.stepNumber}>{step.number}</Text>
          <Text style={styles.stepText}>{step.text}</Text>
        </View>
      ))}
    </View>
  );

  const disclaimerSection = () => (
    <View style={styles.disclaimerContainer}>
      <Image source={Lock} style={styles.lock} />
      <Text style={styles.disclaimerText}>{t('FinicityPermissionText')}</Text>
    </View>
  );

  const directDepositInfo = () => (
    <View style={styles.container}>
      {stepsSection()}
      {disclaimerSection()}
    </View>
  );

  return (
    <ScrollView bounces={false} style={styles.scrollView}>
      <Text style={styles.title}>{t('LandingPageTitle')}</Text>
      <MAAttributedText
        text={t('LandingPageSubtitle')}
        textStyle={styles.subtitle}
        styledTexts={STYLED_TEXT}
      />
      {directDepositInfo()}
    </ScrollView>
  );
};

export default MAScrollableView;
