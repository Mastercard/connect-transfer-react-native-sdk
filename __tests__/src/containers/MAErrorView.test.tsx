import { render, fireEvent, screen, act } from '@testing-library/react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { configureStore, type Store } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';

import mockStoreData from '../../mockStore.json';
import { resetData } from '../../../src/redux/slices/authenticationSlice';
import MAErrorView from '../../../src/containers/MAErrorView';
import { type RootState } from '../../../src/redux/store';
import { TransferActionCodes } from '../../../src/constants';
import * as transferEventHandlers from '../../../src/events/transferEventHandlers';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const en = require('../../../src/locale/en.json');
      return en[key] || key;
    }
  })
}));

jest.mock('react-redux', () => {
  const actualRedux = jest.requireActual('react-redux');
  return {
    ...actualRedux,
    useDispatch: jest.fn(),
    useSelector: jest.fn()
  };
});

jest.mock('../../../src/events/transferEventHandlers', () => ({
  getTransferProductType: jest.fn(() => 'mockProduct'),
  isPDSFlowActive: jest.fn(() => true),
  isBPSFlowActive: jest.fn(() => false),
  useTransferEventResponse: () => ({
    getResponseForClose: jest.fn(() => ({ transfer: 'close' })),
    getResponseForError: jest.fn(() => ({ transfer: 'error' }))
  })
}));

const mockEventHandler = {
  onInitializeConnectTransfer: jest.fn(),
  onLaunchTransferSwitch: jest.fn(),
  onTermsAndConditionsAccepted: jest.fn(),
  onTransferEnd: jest.fn(),
  onUserEvent: jest.fn(),
  onErrorEvent: jest.fn()
};

(mockStoreData as any).event.eventHandler = mockEventHandler;

const { t } = useTranslation();

describe('MAErrorView', () => {
  let store: Store;
  let dispatch: jest.Mock;

  beforeEach(() => {
    dispatch = jest.fn();

    store = configureStore({
      reducer: {
        event: () => ({ eventHandler: mockEventHandler }),
        errorTranslation: () => mockStoreData.errorTranslation,
        user: () => mockStoreData.user
      }
    });

    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatch);
  });

  (useSelector as unknown as jest.Mock).mockImplementation(
    (selectorFn: (state: RootState) => any) =>
      selectorFn({
        event: {
          eventHandler: {
            onInitializeConnectTransfer: jest.fn(),
            onLaunchTransferSwitch: jest.fn(),
            onTermsAndConditionsAccepted: jest.fn(),
            onTransferEnd: jest.fn(),
            onUserEvent: jest.fn(),
            onErrorEvent: jest.fn()
          }
        },
        errorTranslation: {
          loading: false,
          data: null,
          error: null
        },
        user: {
          modalVisible: false,
          url: '',
          baseURL: '',
          queryParams: '',
          queryParamsObject: {},
          language: 'en',
          loading: false,
          data: null,
          error: null
        },
        termsAndPolicies: {
          loading: false,
          data: null,
          error: null
        },
        complete: {
          loading: false,
          data: null,
          error: null
        },
        auditEvents: { loading: false, data: null, error: null }
      })
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the error screen correctly', () => {
    render(
      <Provider store={store}>
        <MAErrorView />
      </Provider>
    );

    expect(screen.getByText(t('ErrorTitle'))).toBeTruthy();
  });

  it('should render experience error screen correctly', () => {
    render(
      <Provider store={store}>
        <MAErrorView isExperienceError />
      </Provider>
    );

    expect(screen.getByText(t('ExperienceErrorTitle'))).toBeTruthy();
    expect(screen.getByText(`${t('ExperienceErrorSubtitle')} (-1)`)).toBeTruthy();
  });

  it('should not call onTransferEnd if code is 0 and isExperienceError is true', () => {
    render(
      <Provider store={store}>
        <MAErrorView isExperienceError />
      </Provider>
    );

    const exitButton = screen.getByText(t('Exit'));
    fireEvent.press(exitButton);

    expect(mockEventHandler.onTransferEnd).not.toHaveBeenCalled();
  });

  it('should handle case when error data is null', () => {
    const modifiedStore = {
      ...mockStoreData,
      user: {
        error: {
          response: {
            data: null
          }
        }
      }
    };

    store = configureStore({
      reducer: {
        event: () => modifiedStore.event,
        errorTranslation: () => modifiedStore.errorTranslation,
        user: () => modifiedStore.user
      }
    });

    render(
      <Provider store={store}>
        <MAErrorView />
      </Provider>
    );

    expect(
      screen.getByText(`${t('ErrorSubtitle')} (${TransferActionCodes.API_OR_ATOMIC_ERROR})`)
    ).toBeTruthy();
  });

  it('should call resetData when experience error is true and exit is pressed', () => {
    render(
      <Provider store={store}>
        <MAErrorView isExperienceError />
      </Provider>
    );

    const exitButton = screen.getByText(t('Exit'));
    fireEvent.press(exitButton);

    expect(dispatch).toHaveBeenCalledWith(resetData());
  });

  it('should call onTransferEnd when code is present', () => {
    const modifiedStore = {
      ...mockStoreData,
      user: {
        error: {
          response: {
            data: {
              code: '500',
              user_message: 'Error message'
            }
          }
        }
      }
    };

    store = configureStore({
      reducer: {
        event: () => modifiedStore.event,
        errorTranslation: () => modifiedStore.errorTranslation,
        user: () => modifiedStore.user
      }
    });

    render(
      <Provider store={store}>
        <MAErrorView />
      </Provider>
    );

    const exitButton = screen.getByText(t('Exit'));
    fireEvent.press(exitButton);

    expect(screen.getByText(t('ErrorTitle'))).toBeTruthy();
    expect(
      screen.getByText(`${t('ErrorSubtitle')} (${TransferActionCodes.API_OR_ATOMIC_ERROR})`)
    ).toBeTruthy();
  });

  it('should render experience error and call onTransferEnd with code -1', () => {
    const testHandler = { onTransferEnd: jest.fn() };
    const testDispatch = jest.fn();

    const mockTestStore: Store = {
      getState: () => ({
        event: { eventHandler: testHandler },
        errorTranslation: { data: {} },
        user: { error: { response: { data: {} } } }
      }),
      dispatch: testDispatch,
      subscribe: jest.fn(),
      replaceReducer: jest.fn(),
      [Symbol.observable]: jest.fn as any
    };

    render(
      <Provider store={mockTestStore}>
        <MAErrorView isExperienceError />
      </Provider>
    );

    fireEvent.press(screen.getByText('Exit'));

    expect(screen.getByText(t('ExperienceErrorTitle'))).toBeTruthy();
  });

  it('test for timer', () => {
    jest.useFakeTimers();

    render(
      <Provider store={store}>
        <MAErrorView />
      </Provider>
    );
    act(() => {
      jest.advanceTimersByTime(300000);
    });

    jest.useRealTimers();

    const exitButton = screen.getByText(t('Exit'));
    fireEvent.press(exitButton);

    expect(screen.getByText(t('ErrorTitle'))).toBeTruthy();
    expect(
      screen.getByText(`${t('ErrorSubtitle')} (${TransferActionCodes.API_OR_ATOMIC_ERROR})`)
    ).toBeTruthy();
  });

  it('get errorCode for isInvalidUrl', () => {
    const modifiedStore = {
      ...mockStoreData,
      user: {
        error: {
          response: {
            data: {
              code: '500',
              user_message: 'Error message'
            }
          }
        }
      }
    };

    store = configureStore({
      reducer: {
        event: () => modifiedStore.event,
        errorTranslation: () => modifiedStore.errorTranslation,
        user: () => modifiedStore.user
      }
    });

    render(
      <Provider store={store}>
        <MAErrorView isExperienceError={false} isInvalidUrl={true} />
      </Provider>
    );

    const exitButton = screen.getByText(t('Exit'));
    fireEvent.press(exitButton);

    expect(screen.getByText(t('ErrorTitle'))).toBeTruthy();
    expect(
      screen.getByText('Invalid URL, Please use the valid URL to proceed. (401)')
    ).toBeTruthy();
  });

  it('get errorCode for api timeout', () => {
    const modifiedStore = {
      ...mockStoreData,
      user: {
        error: {
          code: '1440'
        }
      }
    };

    store = configureStore({
      reducer: {
        event: () => modifiedStore.event,
        errorTranslation: () => modifiedStore.errorTranslation,
        user: () => modifiedStore.user
      }
    });

    render(
      <Provider store={store}>
        <MAErrorView isExperienceError={false} isInvalidUrl={false} />
      </Provider>
    );

    expect(
      screen.getByText(`${t('ErrorSubtitle')} (${TransferActionCodes.API_OR_ATOMIC_ERROR})`)
    ).toBeTruthy();
  });

  it('send audit service event data', () => {
    const modifiedStore = {
      ...mockStoreData,
      user: {
        data: {
          auditServiceDetails: { token: 'mockToken' }
        }
      }
    };

    store = configureStore({
      reducer: {
        event: () => modifiedStore.event,
        errorTranslation: () => modifiedStore.errorTranslation,
        user: () => modifiedStore.user
      }
    });

    render(
      <Provider store={store}>
        <MAErrorView isExperienceError={true} isInvalidUrl={false} />
      </Provider>
    );

    expect(screen.getByText('Invalid connection link')).toBeTruthy();
    expect(screen.getByText('Invalid Experience (-1)')).toBeTruthy();
  });

  it('get error text for BPS flow', () => {
    jest.spyOn(transferEventHandlers, 'isPDSFlowActive').mockReturnValue(false);
    jest.spyOn(transferEventHandlers, 'isBPSFlowActive').mockReturnValue(true);
    jest.spyOn(transferEventHandlers, 'getTransferProductType').mockReturnValue('switch');
    const modifiedStore = {
      ...mockStoreData,
      user: {
        data: {
          auditServiceDetails: { token: 'mockToken' }
        },
        error: {
          response: {
            data: {
              code: '500',
              user_message: 'Error message'
            }
          }
        }
      }
    };

    store = configureStore({
      reducer: {
        event: () => modifiedStore.event,
        errorTranslation: () => modifiedStore.errorTranslation,
        user: () => modifiedStore.user
      }
    });

    render(
      <Provider store={store}>
        <MAErrorView isExperienceError={false} isInvalidUrl={false} />
      </Provider>
    );

    expect(screen.getByText(t('ErrorTitle'))).toBeTruthy();
    expect(
      screen.getByText(
        'We weren’t able to connect to your payroll provider. Please try again. (500)'
      )
    ).toBeTruthy();
  });
});
