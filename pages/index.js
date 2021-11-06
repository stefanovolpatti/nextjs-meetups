import MeetupList from '../components/meetups/MeetupList';
import {Fragment} from 'react';
import {MongoClient} from 'mongodb'
import Head from 'next/head';


function HomePage(props) {
	return (
		<Fragment>
			<Head>
				<title>React Meetups</title>
				<meta
					name="description"
					content="Browse a huge list of highly active React meetups!"
				/>
			</Head>
			<MeetupList meetups={props.meetups}/>
		</Fragment>
	)
}

export async function getStaticProps() {

	const client = await MongoClient.connect('mongodb+srv://stefano:Mongodb@cluster0.qf1ny.mongodb.net/meetups?retryWrites=true&w=majority')

	// Entro in possesso del database
	const db = client.db()

	// Accedo alle mie collections
	const meetupsCollection = db.collection('meetups')

	// TRovo i documenti nella collezione
	const meetups = await meetupsCollection.find().toArray()

	// Chiudo la connessione una volta finita
	client.close();

	return {
		props: {
			meetups: meetups.map(meetup => ({
				title: meetup.title,
				address: meetup.address,
				image: meetup.image,
				id: meetup._id.toString(),
			})),
		},
		revalidate: 10,
	}
}

// Server Side Rendering
/*export async function getServerSideProps(context) {
 const req = context.req
 const res = context.res

 return {
 props: {
 meetups: DUMMY_MEETUP,
 },
 }
 }*/

export default HomePage;