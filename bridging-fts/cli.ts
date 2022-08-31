import readline from 'readline';
import { BridgeService } from './bridge';

async function readUserInput(rl: readline.Interface, question: string): Promise<string> {
    console.log(question);
    const it = rl[Symbol.asyncIterator]();
    const line1 = await it.next();
    line1.done
    return line1.value
}

// TODO extract mint/unlock from 2) and 3) and enable calling them as standalone when providing transaction hash as input
// TODO add input for number of tokens in 2) and 3)
// TODO add input for FT in 1), 2) and 3)
const promptMessage = `
Choose action:
  1) Transfer tokens from source network
  2) Transfer tokens to source network
  *) Any other input exits
`;

/**
 * Runs the prompt which allows performing an action
 * in order to transfer tokens through the bridge
 *
 * @param {BridgeService} bridge
 */
export function runPrompt(bridge: BridgeService) {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const waitForUserInput = function () {
        rl.question(promptMessage, async function (answer) {
            if (answer == '1') {

                const account = await readUserInput(rl, 'Enter NEAR Testnet account to transfer from:')
                const contractId = await readUserInput(rl, 'Enter FT token account id of FT you want to transfer (e.g. wrap.testnet): ');
                const amount = await readUserInput(rl, 'Enter amount of FT for transferring to the ' + contractId + ' contract while calling the method ft_transfer_call:');
                

                bridge.transferFungibleTokenToDestinationConnector(account, contractId, amount)
                    .then(() => waitForUserInput());
            } else if (answer == '2') {

                const account = await readUserInput(rl, 'Enter Calimero account to transfer from:')
                const sourceContractId = await readUserInput(rl, 'Enter FT token account id (on NEAR Testnet) of FT you want to withdraw (e.g. wrap.testnet): ');        
                const amount = await readUserInput(rl, 'Enter amount of FT for withdrawing: ');

                bridge.transferFungibleTokenToSourceConnector(account, sourceContractId, amount)
                    .then(() => waitForUserInput());
            } else {
                rl.close();
            }
        });
    };

    waitForUserInput();
}