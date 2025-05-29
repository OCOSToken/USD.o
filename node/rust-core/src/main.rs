use warp::Filter;
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};

#[derive(Debug, Serialize, Deserialize, Clone)]
struct NodeInfo {
    id: String,
    chain: String,
    status: String,
    synced: bool,
}

#[tokio::main]
async fn main() {
    env_logger::init();

    let info = Arc::new(Mutex::new(NodeInfo {
        id: "usd-node-001".into(),
        chain: "USD.o Chain".into(),
        status: "running".into(),
        synced: true,
    }));

    let info_filter = warp::any().map({
        let info = info.clone();
        move || warp::reply::json(&*info.lock().unwrap())
    });

    let routes = warp::path("status").and(info_filter);

    println!("USD.o Node running at http://localhost:3030/status");
    warp::serve(routes).run(([127, 0, 0, 1], 3030)).await;
}
