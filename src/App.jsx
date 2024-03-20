import { Provider } from 'react-redux'
import Router from './layout/Router'
import store from './store'

// Add stylings
import "./App.scss"

const App = () => {

    return (
        <Provider store={store}>
            <Router />
        </Provider>
    );

}

export default App;
