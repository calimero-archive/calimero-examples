import { CalimeroAuth } from 'calimero-auth-sdk';

export default function Login() {
    if (!CalimeroAuth.isSignedIn()) {
        CalimeroAuth.signIn({
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
