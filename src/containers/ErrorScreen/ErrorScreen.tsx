import { SafeAreaView, Text, Image, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import ErrorIcon from '../../assets/errorIcon.png';
import SecuredBy from '../../components/SecuredBy';
import MAButton from '../../components/MAButton';
import { ErrorScreenStyles as styles } from './Styles';
import { RedirectReason } from '../ConnectTransfer/transferEventConstants';
import { useTransferEventResponse } from '../ConnectTransfer/transferEventHandlers';
import { useSelector } from 'react-redux';
import { type RootState } from '../../redux/store';
import { getTranslation } from '../../utility/utils';

const ErrorScreen: React.FC = () => {
  const { t } = useTranslation();

  const { eventHandler: transferEventHandler } =
    useSelector((state: RootState) => state.event) || null;
  const { code, user_message } = useSelector(
    (state: RootState) => (state.user?.error as any)?.response?.data
  );

  const { data } = useSelector((state: RootState) => state.errorTranslation) ?? {};

  const { getResponseForClose } = useTransferEventResponse();

  const onExitPressed = () => {
    transferEventHandler?.onTransferEnd(getResponseForClose(RedirectReason.EXIT));
  };

  const ErrorScreenFooter = () => {
    return (
      <View style={styles.footerView}>
        <MAButton text={t('Exit')} style={styles.tryAgainButton} onPress={onExitPressed} />
        <SecuredBy />
      </View>
    );
  };

  const getSubtitle = () => {
    const errorText = data && getTranslation(user_message, data);
    return code && user_message ? `${errorText} (${code})` : t('ErrorSubtitle');
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.errorView}>
        <Text style={styles.titleText}>{t('ErrorTitle')}</Text>
        <Text style={styles.descriptionText}>{getSubtitle()}</Text>
        <Image source={ErrorIcon} resizeMode="contain" style={styles.errorIcon} />
        <ErrorScreenFooter />
      </View>
    </SafeAreaView>
  );
};

export default ErrorScreen;
