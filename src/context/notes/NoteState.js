import { useState } from "react";
import NoteContext from "./noteContext";

// const NoteState = (props)=>{
//     const s1 = {
//         "name": "Harry",
//         "class": "5b"
//     }
//     const [state,setState] = useState(s1);
//     const update = ()=>{
//         setTimeout(() => {
//             setState({
//                "name": "Tanuja",
//                "class": "BCA"
//             })

//         }, 1000);
//     }
//     return (
//         <NoteContext.Provider value={{state,update}}>//provide state 
//             {props.children}// available state to all children 
//         </NoteContext.Provider>
//     )
// }

const NoteState = (props) => {
  const host = "http://localhost:3000";
 // const notesInitial = [];
 // const [notes, setNotes] = useState(notesInitial);
 const [notes, setNotes] = useState([]);
  
   //Get all Note

   const getNotes = async () => {
    //TODO API Call
    try {
      console.log("getNotes function called"); 
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem('token')// // Fetch the auth token from local storage
        
      }
     
    });
    const json = await response.json();
    //setNotes(json);
    const flatNotes = json.flat();// .flat() method is a JavaScript array method that flattens nested arrays into a single-level array.
    setNotes(flatNotes); // Update the state
    console.log("Fetched notes:", flatNotes);
//notes set and view in browser &// Set the fetched notes to state
  } catch (error) {
    console.error('Error fetching notes:', error);
  }
}

  //Add a Note

  const addNote = async (title, description, tag) => {
    //TODO API Call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem('token')
      },
      body: JSON.stringify({title,description,tag }),// Sending the new note details to the backend
    });
    const note = await response.json();
    setNotes(notes.concat(note));// Add the new note to the state
  };

  //Delete a Note

  const deleteNote = async (id) => {
    //TODO API Call
     
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token":
            localStorage.getItem('token')
        }
        
      });
     const json = response.json();// Parse the response from the backend
    const newNotes = notes.filter((note) => {// Filter out the deleted note
      return note._id !== id;
    });
    setNotes(newNotes); // Update the state with the new list
  };

  //Edit a Note

  const editNote = async (id, title, description, tag) => {
    //TODO API Call for also edit in backend mean db
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem('token')
      },
      body: JSON.stringify({title,description,tag}),// Send updated note details to the backend
    });
    const json = await response.json();// Parse the response from the backend
  // eslint-disable-next-line
    let newNotes = JSON.parse(JSON.stringify(notes))  // Create a deep copy of the notes array
    // Logic to edit the note on the client-side
  
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
      
    }
    setNotes(newNotes);// Update the state with the edited note
  };
  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};
/*
Context Value: It passes down the notes, addNote, deleteNote, editNote, and getNotes functions via the value prop so that any child component can access them via the NoteContext.
*/

export default NoteState;

/*
Why Deep Copy?
notes is an array of note objects that is currently stored in the state. Since state in React is immutable (you shouldn't directly modify it), we cannot modify the notes array directly.
To avoid mutating the original array and potentially causing unexpected behavior, we create a deep copy of the array before modifying it.
How the Deep Copy Works:
JSON.stringify(notes) converts the notes array into a JSON string.
JSON.parse(...) then converts that string back into a new JavaScript object, effectively creating a deep copy.
A deep copy means that if the notes array contains any nested objects (like the note object itself), it will copy those objects as well, rather than just copying references to them. This ensures that the changes made to newNotes do not affect the original notes state directly
*/
