use ethers::prelude::*;

use crate::db;
use crate::db::Record;
use ethers::{
    contract::abigen,
    core::utils::Anvil,
    middleware::SignerMiddleware,
    signers::{LocalWallet, Signer},
};
use eyre::Result;
use std::{convert::TryFrom, sync::Arc, time::Duration};

use ethers::{
    core::types::{Address, U256},
    providers::{Http, Provider, Ws},
};

use tokio::sync::broadcast;

abigen!(Link, "abi/Link.json",);

pub async fn start(
    contract_creation_block: u64,
    local: bool,
    mut shutdown: broadcast::Receiver<()>,
    insert_send: broadcast::Sender<Record>,
    post_send: broadcast::Sender<Record>,
) -> Result<()> {
    let anvil;
    let contract = if local {
        anvil = Anvil::new().port(8546 as u16).spawn();
        let wallet: LocalWallet = anvil.keys()[0].clone().into();

        let provider_http =
            Provider::<Http>::try_from(anvil.endpoint())?.interval(Duration::from_millis(10u64));

        let client = Arc::new(SignerMiddleware::new(
            provider_http,
            wallet.with_chain_id(anvil.chain_id()),
        ));

        let deploy_contract = Link::deploy(client, U256::from(0))?.send().await?;

        let provider = Provider::<Ws>::connect(anvil.ws_endpoint()).await?;
        let client = Arc::new(provider);
        Link::new(deploy_contract.address(), client)
    } else {
        let provider = Provider::<Ws>::connect(std::env::var("WSS_URL")?).await?;
        let client = Arc::new(provider);
        let address: Address = std::env::var("LINK_ADDRESS")?.parse()?;
        Link::new(address, client)
    };

    println!("Contract address: {:?}", contract.address());

    let events = contract.events().from_block(contract_creation_block);

    let mut stream = events.stream().await?;

    loop {
        tokio::select! {
            _ = shutdown.recv() => {
                println!("Shutting down");
                break;
            }
            Some(Ok(f)) = stream.next() => {
                println!("Event: {f:?}");
                match f {
                    LinkEvents::CompanyCreatedFilter(f) => {
                        insert_send.send(Record::CompanyCreated(db::Id(f.company_id), db::Name(f.name), db::Owner(f.owner)))?;
                    }
                    LinkEvents::EmployeeAddedFilter(f) => {
                        insert_send.send(Record::EmployeeAdded(db::Id(f.company_id), db::Employee(f.employee)))?;
                    }
                    LinkEvents::EmployeeConfirmedFilter(f) => {
                        let record = Record::EmployeeConfirmed(db::Id(f.company_id), db::Employee(f.employee), db::MinaSignature(Some(f.mina_signature)));
                        insert_send.send(record.clone())?;
                        post_send.send(record)?;
                    }
                }

            }
        }
    }

    Ok(())
}
