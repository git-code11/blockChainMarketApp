var rawMessage = "Hello World";
var rawMessageLength = new Blob([rawMessage]).size
var message = ethers.utils.toUtf8Bytes("\x19Ethereum Signed Message:\n" + rawMessageLength + rawMessage)
message = ethers.utils.keccak256(message)
var params = [
    await this.signer.getAddress(),
    message
]
this.signature = await this.wc.connector.signMessage(params);
this.verified = ethers.utils.verifyMessage(rawMessage, this.signature);

k = await connector.signMessage(params);
signer.provider.provider