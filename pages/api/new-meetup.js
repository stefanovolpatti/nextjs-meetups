import {MongoClient} from 'mongodb'

async function handler(req, res) {
	if (req.method === 'POST') {
		const data = req.body;

		// Chiamo Mongodb
		const client = await MongoClient.connect('mongodb+srv://stefano:Mongodb@cluster0.qf1ny.mongodb.net/meetups?retryWrites=true&w=majority')

		// Entro in possesso del database
		const db = client.db()

		// Accedo alle mie collections
		const meetupsCollection = db.collection('meetups')

		// Inserisco un nuovo documento alla collezione
		const result = await meetupsCollection.insertOne(data)
		console.log(result);

		// Chiudo la connessione una volta finita e ritorno la risposta
		client.close()

		// Metodo status che posso chiamare alla risposta per settare lo stato HTTP della risposta che ritornerò
		res.status(201).json({message: 'Meetup inserted!'});
	}
}

export default handler;