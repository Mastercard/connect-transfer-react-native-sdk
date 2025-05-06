import { render, fireEvent, act } from '@testing-library/react-native';
import { useSelector, useDispatch } from 'react-redux';
import i18next from 'i18next';

import MARootContainer, {
  isSkipLandingPageEnabled,
  isExperienceError
} from '../../../src/containers/MARootContainer';
import { setUrl, setUrlData, resetData } from '../../../src/redux/slices/authenticationSlice';
import { setEventHandlers } from '../../../src/redux/slices/eventHandlerSlice';
import { authenticateUser } from '../../../src/services/api/authenticate';
import { errorTranslation } from '../../../src/services/api/errorTranslation';
import { extractUrlData } from '../../../src/utility/utils';
import { type ConnectTransferEventHandler } from '../../../src/containers/ConnectTransfer/transferEventConstants';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

jest.mock('../../../src/services/api/authenticate', () => ({
  authenticateUser: jest.fn()
}));

jest.mock('../../../src/services/api/errorTranslation', () => ({
  errorTranslation: jest.fn()
}));

jest.mock('i18next', () => ({
  changeLanguage: jest.fn()
}));

jest.mock('../../../src/containers/ConnectTransfer/transferEventHandlers', () => ({
  useTransferEventResponse: () => ({
    getResponseForInitializeTransfer: jest.fn(() => ({ transfer: 'initialize' })),
    getResponseForClose: jest.fn(() => ({ transfer: 'close' }))
  })
}));

jest.mock('../../../src/containers/LandingView/MALandingView', () => {
  const { Text } = require('react-native');
  return (props: any) => <Text onPress={props.onNextPress}>MockLandingView</Text>;
});

jest.mock('../../../src/containers/MARedirectingView', () => {
  const { Text } = require('react-native');
  return () => <Text>MockRedirectingView</Text>;
});

jest.mock('../../../src/containers/MAErrorView', () => {
  const { Text } = require('react-native');
  return () => <Text>MockErrorView</Text>;
});

jest.mock('../../../src/components/MALoader', () => {
  const { Text } = require('react-native');
  return () => <Text>MockLoader</Text>;
});

describe('MARootContainer', () => {
  const mockDispatch = jest.fn();

  const mockEventHandler: ConnectTransferEventHandler = {
    onInitializeConnectTransfer: jest.fn(),
    onTermsAndConditionsAccepted: jest.fn(),
    onLaunchTransferSwitch: jest.fn(),
    onTransferEnd: jest.fn(),
    onUserEvent: jest.fn(),
    onErrorEvent: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  });

  const renderComponent = (customState: { user?: any; event?: any } = {}) => {
    (useSelector as unknown as jest.Mock).mockImplementation(callback =>
      callback({
        user: {
          modalVisible: true,
          language: 'en',
          error: false,
          queryParamsObject: {},
          data: {
            data: {
              experience: {
                id: 'test',
                transferModule: { moduleType: 'PDS', enabled: true },
                customizations: { skipLandingPage: false }
              }
            }
          },
          ...customState.user
        },
        event: {
          eventHandler: mockEventHandler,
          ...customState.event
        }
      })
    );

    return render(
      <MARootContainer connectTransferUrl="https://mockurl.com" eventHandlers={mockEventHandler} />
    );
  };

  it('renders modal when modalVisible is true', () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('test-modal')).toBeTruthy();
  });

  it('calls closeModal and dispatches resetData when modal closed', () => {
    const { getByTestId } = renderComponent();
    fireEvent(getByTestId('test-modal'), 'onRequestClose');
    expect(mockEventHandler.onTransferEnd).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(resetData());
  });

  it('dispatches setUrl, setUrlData, setEventHandlers when connectTransferUrl is provided', () => {
    renderComponent();
    expect(mockDispatch).toHaveBeenCalledWith(setEventHandlers(mockEventHandler));
    expect(mockDispatch).toHaveBeenCalledWith(setUrl('https://mockurl.com'));
  });

  it('dispatches setUrlData with extracted URL data when connectTransferUrl is provided', () => {
    const mockUrl = 'https://example.com?param1=value1&param2=value2';

    render(<MARootContainer connectTransferUrl={mockUrl} eventHandlers={mockEventHandler} />);

    expect(mockDispatch).toHaveBeenCalledWith(setUrlData(extractUrlData(mockUrl)));
  });

  it('dispatches authenticateUser, errorTranslation, and language change', () => {
    renderComponent({
      user: {
        baseURL: 'https://mockurl.com/'
      }
    });
    expect(mockDispatch).toHaveBeenCalledWith(authenticateUser(expect.any(String)));
    expect(mockDispatch).toHaveBeenCalledWith(errorTranslation(expect.any(String)));
    expect(i18next.changeLanguage).toHaveBeenCalledWith('en');
  });

  it('calls onInitializeConnectTransfer on data ready', () => {
    renderComponent();
    expect(mockEventHandler.onInitializeConnectTransfer).toHaveBeenCalled();
  });

  it('renders MAErrorView when isError is true', () => {
    const { getByText } = renderComponent({
      user: { error: true }
    });
    expect(getByText('MockErrorView')).toBeTruthy();
  });

  it('renders MARedirectingView when skipLandingPage is true', () => {
    const { getByText } = renderComponent({
      user: {
        data: {
          data: {
            experience: {
              transferModule: { moduleType: 'PDS', enabled: true },
              customizations: { skipLandingPage: true }
            }
          }
        }
      }
    });
    expect(getByText('MockRedirectingView')).toBeTruthy();
  });

  it('renders MALandingView and transitions to MARedirectingView after onNextPress', async () => {
    const { getByText, queryByText } = renderComponent();
    const landingView = getByText('MockLandingView');
    expect(landingView).toBeTruthy();
    await act(async () => {
      fireEvent.press(landingView);
    });
    expect(queryByText('MockRedirectingView')).toBeTruthy();
  });

  it('renders MALoader when no data and no error', () => {
    const { getByText } = renderComponent({
      user: { data: null }
    });
    expect(getByText('MockLoader')).toBeTruthy();
  });
});

describe('Helper functions', () => {
  it('isSkipLandingPageEnabled returns true if conditions match', () => {
    const result = isSkipLandingPageEnabled({
      data: {
        experience: {
          transferModule: { moduleType: 'PDS', enabled: true },
          customizations: { skipLandingPage: true }
        }
      }
    });
    expect(result).toBe(true);
  });

  it('isSkipLandingPageEnabled returns false otherwise', () => {
    expect(isSkipLandingPageEnabled({})).toBe(false);
  });

  it('isExperienceError returns true for invalid experience', () => {
    expect(isExperienceError({ data: { experience: { id: 'test' } } })).toBe(true);
  });

  it('isExperienceError returns false when experience is valid', () => {
    const result = isExperienceError({
      data: { experience: { id: 'test', transferModule: { moduleType: 'PDS', enabled: true } } }
    });
    expect(result).toBe(false);
  });
});
