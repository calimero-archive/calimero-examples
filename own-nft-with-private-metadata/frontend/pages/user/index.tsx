import React, {useEffect, useState} from "react";
import LoginWithNear from "../../components/LoginWithNear";
import {getCalimeroSdk} from "../../wallet/WalletUtils";
import UserRecordsTable from "./UserRecordsTable";

export default function UserData() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (getCalimeroSdk().isSignedIn()) {
            console.log("logged in");
            setLoggedIn(true);
        } else {
            console.log("not logged in");
        }

    }, [loggedIn]);

    return (
        <div>
            {loggedIn ?
                <UserRecordsTable />
                :
                <div className="px-4 py-8 sm:px-0" >
                    <LoginWithNear onClick={getCalimeroSdk().signIn} />
                </div>
            }
        </div>
    );
}
