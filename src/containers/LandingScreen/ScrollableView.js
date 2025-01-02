import { ScrollView, Text, View, Image } from 'react-native';
import { useTranslation } from 'react-i18next';

import MAAttributedText from '../../components/MAAttributedText';
import { LandingScreenScrollableViewStyle as styles } from './Styles';

import Lock from '../../assets/lock.png';
import CrossDismiss from '../../components/CrossDismiss';

const ScrollableView = () => {
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

  const StepItem = ({ number, text }) => (
    <View style={styles.stepItem}>
      <Text style={styles.stepNumber}>{number}</Text>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );

  const StepsSection = () => (
    <View style={styles.stepsContainer}>
      <Text style={styles.headerText}>{`${t('LandingPageStepInstructionText')}:`}</Text>
      {STEPS.map((step, index) => (
        <StepItem key={index} number={step.number} text={step.text} />
      ))}
    </View>
  );

  const DisclaimerSection = () => (
    <View style={styles.disclaimerContainer}>
      <Image source={Lock} style={styles.lock} />
      <Text style={styles.disclaimerText}>{t('FinicityPermissionText')}</Text>
    </View>
  );

  const DirectDepositInfo = () => (
    <View style={styles.container}>
      <StepsSection />
      <DisclaimerSection />
    </View>
  );

  const onCrossPress = () => {};

  return (
    <ScrollView bounces={false} style={styles.scrollView}>
      <CrossDismiss onCrossPress={onCrossPress} />
      <Text style={styles.title}>{t('LandingPageTitle')}</Text>
      <MAAttributedText
        text={t('LandingPageSubtitle')}
        textStyle={styles.subtitle}
        styledTexts={STYLED_TEXT}
      />
      <DirectDepositInfo />
    </ScrollView>
  );
};

export default ScrollableView;
