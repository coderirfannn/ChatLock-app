import { StyleSheet, Text, View } from 'react-native'
import StackNavigator from './StackNavigator'
import { UserContext } from './UseContext' //

const App = () => {
  return (
    <UserContext>
      <StackNavigator />
    </UserContext>
  )
}

export default App
