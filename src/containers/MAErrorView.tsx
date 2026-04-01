import { useEffect, useRef } from 'react';
import { SafeAreaView, Text, Image, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import ErrorIcon from '../assets/errorIcon.png';
import MASecuredBy from '../components/MASecuredBy';
import MAButton from '../components/MAButton';
import { MAErrorViewStyles as styles } from './ContainerStyles';
import {
  ListenerType,
  RedirectReason,
  TransferActionCodes,
  TransferActionEvents
} from '../constants';
import { type MAErrorViewProps } from '../intefaces';
import { isBPSFlowActive, useTransferEventResponse } from '../events/transferEventHandlers';
import { AppDispatch, type RootState } from '../redux/store';
import { getTranslation } from '../utility/utils';
import { resetData } from '../redux/slices/authenticationSlice';
import { eventQueue, useSendAuditData } from '../events/auditEventQueue';

const MAErrorView: React.FC<MAErrorViewProps> = ({
  isExperienceError = false,
  isInvalidUrl = false
}) => {
  const dispatch: AppDispatch = useDispatch();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { t } = useTranslation();

  const { eventHandler: transferEventHandler } = useSelector(
    (state: RootState) => state.event || {}
  );
  const { data } = useSelector((state: RootState) => state.errorTranslation || {});
  const errorData = useSelector(
    (state: RootState) => (state.user?.error as any)?.response?.data ?? {},
    shallowEqual
  );
  const error = useSelector((state: RootState) => state.user?.error as any);
  const auditServiceToken = useSelector(
    (state: RootState) => (state.user?.data as any)?.auditServiceDetails?.token
  );
  const product = useSelector((state: RootState) => (state.user?.data as any)?.data?.product);

  const { getResponseForClose, getResponseForError } = useTransferEventResponse();
  const sendAuditData = useSendAuditData();

  const FIVE_MINUTES = 5 * 60 * 1000;
  const { code, user_message } = errorData;
  const errorText = data && getTranslation(user_message, data);
  const isApiTimeout = error?.code === TransferActionCodes.API_TIMEOUT;
  const finalCode = getFinalCode();

  useEffect(() => {
    transferEventHandler?.onErrorEvent(getResponseForError(finalCode));
    auditServiceToken && sendAuditData(TransferActionEvents.ERROR, { code: finalCode });

    timeoutRef.current = setTimeout(() => {
      onExitPressed();
    }, FIVE_MINUTES);

    return () => {
      clearTimeoutRef();
    };
  }, []);

  function getFinalCode() {
    let errorCode = isExperienceError ? -1 : code;

    if (isInvalidUrl) {
      errorCode = TransferActionCodes.INVALID_URL;
    } else if (isApiTimeout) {
      errorCode = TransferActionCodes.API_TIMEOUT;
    }
    return errorCode;
  }

  const clearTimeoutRef = () => {
    if (timeoutRef?.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const onExitPressed = () => {
    transferEventHandler?.onTransferEnd(getResponseForClose(RedirectReason.ERROR, finalCode));
    auditServiceToken &&
      sendAuditData(TransferActionEvents.END, {
        code: finalCode,
        reason: RedirectReason.ERROR,
        listenerType: ListenerType.CLOSE
      });
    eventQueue.destroy();
    dispatch(resetData());
    clearTimeoutRef();
  };

  const errorScreenFooter = () => {
    return (
      <View style={styles.footerView}>
        <MAButton text={t('Exit')} onPress={onExitPressed} />
        <MASecuredBy />
      </View>
    );
  };

  const getErrorText = () => {
    let title = t('ErrorTitle');
    let subTitle = isBPSFlowActive(product)
      ? `${t('ErrorSubtitleBPS')} (${TransferActionCodes.API_OR_ATOMIC_ERROR})`
      : `${t('ErrorSubtitle')} (${TransferActionCodes.API_OR_ATOMIC_ERROR})`;

    if (isInvalidUrl) {
      subTitle = `${t('InvalidUrlErrorSubtitle')} (${TransferActionCodes.INVALID_URL})`;
    } else if (isApiTimeout) {
      subTitle = `${t('ServerTimeoutErrorSubtitle')} (${TransferActionCodes.API_TIMEOUT})`;
    } else if (isExperienceError) {
      title = t('ExperienceErrorTitle');
      subTitle = `${t('ExperienceErrorSubtitle')} (${TransferActionCodes.INVALID_EXPERIENCE})`;
    } else if (code && user_message) {
      subTitle = `${errorText} (${code})`;
    }

    return { title, subTitle };
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
