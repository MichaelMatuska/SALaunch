import React, { useState, useEffect } from 'react';
import './App.css';
import Amplify, { API, Storage, Predictions } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listTicketInputs } from './graphql/queries';
import { createTicketInput as createNoteMutation, deleteTicketInput as deleteNoteMutation } from './graphql/mutations';
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import logo from './logo.svg';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

const initialFormState = { name: '', description: '' }

function TextIdentification() {
  const [response, setResponse] = useState("Gather information from uploading an image...powered by ML! ")

  function identifyFromFile(event) {
    setResponse('Gathering information from uploaded image...powered by ML');
    const { target: { files } } = event;
    const [file,] = files || [];

    if (!file) {
      return;
    }
    Predictions.identify({
      text: {
        source: {
          file,
        },
        format: "PLAIN", // Available options "PLAIN", "FORM", "TABLE", "ALL"
      }
    }).then(({text: { fullText }}) => {
      setResponse(fullText)
    })
      .catch(err => setResponse(JSON.stringify(err, null, 2)))
  }

  return (
    <div className="Text">
      <div>
        <h3>Image Search!</h3>
        <input type="file" onChange={identifyFromFile}></input>
        <p>{response}</p>
      </div>
    </div>
  );
}



function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    fetchNotes();
  }

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listTicketInputs });
    const notesFromAPI = apiData.data.listTicketInputs.items;
    await Promise.all(notesFromAPI.map(async note => {
      if (note.image) {
        const image = await Storage.get(note.image);
        note.image = image;
      }
      return note;
    }))
    setNotes(apiData.data.listTicketInputs.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
  }

  return (
    <div className="App">
      <h1>City of Octank - Police Department</h1>
      <h2>Ticketing and Document Managment</h2>
      
       
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Ticket ID"
        value={formData.name}
      />   
       <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="Ticket Notes"
        value={formData.description}
      />
      <button onClick={createNote}>Modify Ticket</button>
      <br/>
      
      <TextIdentification />
      <div style={{marginBottom: 30}}>
      {
        notes.map(note => (
          <div key={note.id || note.name}>
            <h2>{note.name}</h2>
            <p>{note.description}</p>
            <button onClick={() => deleteNote(note)}>Delete Ticket Notes</button>
            {
              note.image && <img src={note.image} style={{width: 400}} />
            }
          </div>
        ))
      }
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);