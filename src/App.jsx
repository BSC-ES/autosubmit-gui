import { Provider } from 'react-redux'
import Router from './common/Router'
import ContextProvider from './components/context/ContextProvider'
import store from './store'

// Add stylings
import "./App.scss"

const App = () => {

    return (
        <Provider store={store}>
            <ContextProvider>
                <Router />
            </ContextProvider>
        </Provider>
    );

}

export default App;
