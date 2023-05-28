
import { store } from './store'
import { Provider } from 'react-redux'

export default ()=>{
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}