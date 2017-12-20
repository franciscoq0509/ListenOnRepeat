import { NavigationActions } from 'react-navigation';

import { AppNavigator } from '../api/AppNavigator';

const mainSceneAction = AppNavigator.router.getActionForPathAndParams('Main');
const initialStateMain = AppNavigator.router.getStateForAction(mainSceneAction);

const initialNavState = AppNavigator.router.getStateForAction(
  initialStateMain,
);

export default function (state = initialNavState, action = {}) {
  return AppNavigator.router.getStateForAction(action, state) || state
}