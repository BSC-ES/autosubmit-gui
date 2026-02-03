import { Provider } from 'react-redux'
import Router from './layout/Router'
import store from './store'
import Toast from './common/Toast'

// Add stylings
import "./App.scss"

const App = () => {

    return (
        <Provider store={store}>
            <Router />
            <Toast />
        </Provider>
    );

}

export default App;
