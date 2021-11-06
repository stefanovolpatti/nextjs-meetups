import MeetupDetail from '../../components/meetups/MeetupDetail';
import {MongoClient, ObjectId} from 'mongodb';
import Head from 'next/head';
import {Fragment} from 'react';

function MeetupDetails(props) {
	return (
		<Fragment>
			<Head>
				<title>{props.meetupData.title}</title>
				<meta name="description" content={props.meetupData.description}/>
			</Head>
			<MeetupDetail
				image={props.meetupData.image}
				title={props.meetupData.title}
				address={props.meetupData.address}
				description={props.meetupData.description}
			/>
		</Fragment>
	);
}

export async function getStaticPaths() {

	const client = await MongoClient.connect('mongodb+srv://stefano:Mongodb@cluster0.qf1ny.mongodb.net/meetups?retryWrites=true&w=majority')

	// Entro in possesso del database
	const db = client.db()

	// Accedo alle mie collections
	const meetupsCollection = db.collection('meetups')

	// Get meetups data
	const meetups = await meetupsCollection.find({}, {_id: 1}).toArray()

	// Chiudo la connessione
	client.close()

	return {
		fallback: false,
		paths: meetups.map(meetup => ({
				params: {
					meetupId: meetup._id.toString(),
				},
			}),
		),

	};
}

export async function getStaticProps(context) {
	// fetch data for a single meetup

	const meetupId = context.params.meetupId;

	const client = await MongoClient.connect('mongodb+srv://stefano:Mongodb@cluster0.qf1ny.mongodb.net/meetups?retryWrites=true&w=majority')

	// Entro in possesso del database
	const db = client.db()

	// Accedo alle mie collections
	const meetupsCollection = db.collection('meetups')

	// Get a single meetupd
	const selectedMeetup = await meetupsCollection.findOne({_id: ObjectId(meetupId)})

	// Chiudo la connessione
	client.close()

	console.log(selectedMeetup);

	return {
		props: {
			meetupData: {
				id: selectedMeetup._id.toString(),
				title: selectedMeetup.title,
				address: selectedMeetup.address,
				image: selectedMeetup.image,
				description: selectedMeetup.description,
			},
		},
	};
}

export default MeetupDetails;