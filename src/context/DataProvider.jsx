import { createContext, useState } from "react";
//CONTEXT API

//import this context in Login.jsx
export const DataContext=createContext(null);
const DataProvider=({children})=>{
    const [account, setAccount]=useState({username: '',email:'',isAdmin:''});
    return(
        <DataContext.Provider value={{
            account,
            setAccount
        }}>
            {children}
        </DataContext.Provider>
    )
}
//whichever components you are going to use these states in, you need to wrap those components with DataProvider
export default DataProvider;