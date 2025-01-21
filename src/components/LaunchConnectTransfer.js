import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Atomic, Product } from '@atomicfi/transact-react-native';

const LaunchConnectTransfer = () => {
  const { data, language } = useSelector(state => state.user) || '';

  const { userToken } = data?.data || '';

  useEffect(() => {
    try {
      Atomic.transact({
        config: {
          publicToken: userToken,
          tasks: [{ product: Product.DEPOSIT }],
          language: language
        },
        onInteraction: interaction => {
          console.log('Interaction event: ', interaction.name, interaction.value);
        },
        onFinish: data => {
          console.log('Finish event: ', data.taskId, data.handoff);
        },
        onClose: data => {
          console.log('Close event: ', data.reason);
        }
      });
    } catch (error) {
      console.error('Error initializing Atomic Transact:', error);
    }
  }, [userToken, language]);

  return <></>;
};

export default LaunchConnectTransfer;
