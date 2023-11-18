# Mina Contract

state
- messageCid
- oraclePublicKey

@publishMessage(messageCid, companyId, signer)
- Gets list of users in company(companyId) from oracle
- Asserts that publicKey(signer) in list
- If true, sets messageCid