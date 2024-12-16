import { init } from "@lib/mongo"

export async function get(res) {
    const { db } = await init();

    const data = await db.collection('sample_mflix').find().toArray();
    res.writeHead(200, {
        "Content-Type": 'application/json'
    });

    res.end(JSON.stringify(data))

}

