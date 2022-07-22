import { CalimeroAuth } from 'calimero-auth-sdk';

export default function Login() {
    const calimeroAuth = new CalimeroAuth()
    if (!calimeroAuth.isSignedIn()) {
        console.log(window.location.href.toString());
        calimeroAuth.signIn({
            shardId: "testing.calimero",
            walletUrl: "https://testnet.mynearwallet.com/verify-owner",
            authServiceUrl: "http://localhost:1336"
        });
    }

    return (
        <div className="App">
            <header className="App-header">
            </header>
        </div>
    );
}
