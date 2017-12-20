import React from 'react'
import { Platform, AppState } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'

import Store, {persistor} from 'api/ReduxStore'
import AppWithNavigationState from 'api/AppNavigator'


class ListenOnRepeat extends React.Component {

  render() {
    return (
      <PersistGate persistor={persistor}>
        <Provider store={store}>
            <AppWithNavigationState />
        </Provider>
      </PersistGate>
    );
  }
}

export default ListenOnRepeat