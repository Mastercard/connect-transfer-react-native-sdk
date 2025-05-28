import { useEffect, useRef } from 'react';
import { SafeAreaView, Text, Image, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import ErrorIcon from '../assets/errorIcon.png';
import MASecuredBy from '../components/MASecuredBy';
import MAButton from '../components/MAButton';
import { MAErrorViewStyles as styles } from './ContainerStyles';
import { RedirectReason } from './ConnectTransfer/transferEventEnums';
import { useTransferEventResponse } from './ConnectTransfer/transferEventHandlers';
import { AppDispatch, type RootState } from '../redux/store';
import { getTranslation } from '../utility/utils';
import { resetData } from '../redux/slices/authenticationSlice';
import { type MAErrorViewProps } from './containerInterfaces';

const MAErrorView: React.FC<MAErrorViewProps> = ({ isExperienceError = false }) => {
  const dispatch: AppDispatch = useDispatch();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { t } = useTranslation();

  const { eventHandler: transferEventHandler } =
    useSelector((state: RootState) => state.event) || null;
  const { data } = useSelector((state: RootState) => state.errorTranslation) ?? {};
  const errorData = useSelector(
    (state: RootState) => (state.user?.error as any)?.response?.data ?? {},
    shallowEqual
  );

  const FIVE_MINUTES = 5 * 60 * 1000;
  const { code, user_message } = errorData;
  const errorText = data && getTranslation(user_message, data);
  const finalCode = isExperienceError ? -1 : code;
  const { getResponseForClose, getResponseForError } = useTransferEventResponse();

  useEffect(() => {
    transferEventHandler?.onErrorEvent(getResponseForError(finalCode));

    timeoutRef.current = setTimeout(() => {
      onExitPressed();
    }, FIVE_MINUTES);

    return () => {
      clearTimeoutRef();
    };
  }, []);

  const clearTimeoutRef = () => {
    if (timeoutRef?.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const onExitPressed = () => {
    transferEventHandler?.onTransferEnd(getResponseForClose(RedirectReason.ERROR, finalCode));
    dispatch(resetData());
    clearTimeoutRef();
  };

  const errorScreenFooter = () => {
    return (
      <View style={styles.footerView}>
        <MAButton text={t('Exit')} style={styles.tryAgainButton} onPress={onExitPressed} />
        <MASecuredBy />
      </View>
    );
  };

  const getErrorText = () => {
    if (isExperienceError) {
      return { title: t('ExperienceErrorTitle'), subTitle: `${t('ExperienceErrorSubtitle')} (-1)` };
    }

    return {
      title: t('ErrorTitle'),
      subTitle: code && user_message ? `${errorText} (${code})` : t('ErrorSubtitle')
    };
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.errorView}>
        <Text style={styles.titleText}>{getErrorText().title}</Text>
        <Text style={styles.descriptionText}>{getErrorText().subTitle}</Text>
        <Image source={ErrorIcon} resizeMode="contain" style={styles.errorIcon} />
        {errorScreenFooter()}
      </View>
    </SafeAreaView>
  );
};

export default MAErrorView;
