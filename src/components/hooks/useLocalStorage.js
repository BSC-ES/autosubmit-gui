import * as React from 'react'

export default function useLocalStorage(key, initialValue = '', {serialize = JSON.stringify, deserialize = JSON.parse} = {}) {
    const [value, setValue] = React.useState(() => {
      const valueInLocalStorage = window.localStorage.getItem(key)
      if(valueInLocalStorage) {
        return deserialize(valueInLocalStorage)
      }
      return typeof initialValue === 'function' ? initialValue() : initialValue
    })
  
    React.useEffect(() => {
      window.localStorage.setItem(key, serialize(value))
    }, [key, serialize, value])
  
    return [value, setValue]
}
