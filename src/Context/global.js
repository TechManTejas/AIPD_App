import { createContext, useContext, useState } from "react";

const GlobalData = createContext()

const GlobalDataContext = ({children}) => {

    const [authenticated, setAuthenticated] = useState(false);

    return (
        <GlobalData.Provider value={{
            authenticated, setAuthenticated
        }}>
            {children}
        </GlobalData.Provider>
    )
}

const GlobalDataState = () => {
    return useContext(GlobalData)
}

export default GlobalDataContext
export { GlobalDataState }