import { ScrollView, Text, View, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import MAAttributedText from '../../components/MAAttributedText';
import { MAScrollableViewStyle as styles } from './MALandingViewStyles';
import Lock from '../../assets/lock.png';

const MAScrollableView = () => {
  const { t } = useTranslation();

  const type = useSelector(state => state.user?.queryParamsObject?.type || {});

  const content = t(`LandingPage.${type}`, { returnObjects: true });
  const STEPS = content?.Steps?.map((text, index) => ({
    number: String(index + 1),
    text
  }));

  const STYLED_TEXT = [
    {
      text: t('LandingPage.FinicityMastercardCompany'),
      style: styles.boldText
    },
    {
      text: t('LandingPage.Atomic'),
      style: styles.boldText
    }
  ];

  const stepsSection = () => (
    <View style={styles.stepsContainer}>
      <Text style={styles.headerText}>{`${t('LandingPage.StepInstruction')}:`}</Text>
      {STEPS?.map(step => (
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
      <Text style={styles.disclaimerText}>{t('LandingPage.FinicityPermission')}</Text>
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
      <Text style={styles.title}>{content.Title}</Text>
      <MAAttributedText
        text={content.SubTitle}
        textStyle={styles.subtitle}
        styledTexts={STYLED_TEXT}
      />
      {directDepositInfo()}
    </ScrollView>
  );
};

export default MAScrollableView;
