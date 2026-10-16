import { Provider } from 'react-redux'
import Router from './layout/Router'
import MaintenanceGate from './layout/MaintenanceGate'
import store from './store'
import Toast from './common/Toast'

import './App.scss'

const App = () => {
    return (
        <MaintenanceGate>
            <Provider store={store}>
                <Router />
                <Toast />
            </Provider>
        </MaintenanceGate>
    )
}

export default App;
