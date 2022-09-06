import React, {useEffect, useState} from "react";
import RegistryRecordsTable from "./RegistryRecordsTable";
import {getCalimeroSdk} from "../../wallet/WalletUtils";
import LoginWithNear from "../../components/LoginWithNear";

export default function Government() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (getCalimeroSdk().isSignedIn()) {
            console.log("logged in");
            setLoggedIn(true);
            // getCalimeroSdk().syncAccount()
        }else{
            console.log("not logged in");
        }
    }, [loggedIn]);

    return (
        <div>
            {loggedIn ?
                <RegistryRecordsTable />
                :
                <div className="px-4 py-8 sm:px-0" >
                    <LoginWithNear onClick={getCalimeroSdk().signIn} />
                </div>
            }
        </div>
    );
}
