import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import noteContext from "../context/notes/noteContext";
import Noteitem from "./Noteitem";
import AddNote from "./AddNote";
import { useEffect, useRef, useState } from "react";

const Notes = (props) => {
  const navigate = useNavigate();
  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;
  useEffect(() => {
    if(localStorage.getItem('token')){
      getNotes();
    }else{
      navigate('/login');
    }
    
  }, []);

console.log("Notes in component:", notes);

  const ref = useRef(null);//give reference to one element 
  const refClose = useRef(null);
 const [note,setNote] = useState({etitle: "",edescription: "",etag: "default"});
   // const {addNote} = context;

  const updateNote = (currentNote) => {
    ref.current.click();// ref give to modal thats why modal is show &// Opens the modal programmatically
    setNote({id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag}); // Populates the form in the modal with the current note's data
    
  }

  const handleClick = (e)=>{
    e.preventDefault();// Prevents page reload
    editNote(note.id,note.etitle,note.edescription,note.etag); // Updates the note in the backend
    refClose.current.click();// Closes the modal programmatically
    props.showAlert("Uploaded Successfully","success")
  //addNote(note.etitle,note.edescription,note.etag);
}

const onChange = (e)=>{//to type or fill text
  setNote({...note,[e.target.name]: e.target.value})// Dynamically updates the note state
}

  return (
    <>
      <AddNote showAlert={props.showAlert} />
      <button
        ref={ref}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Note
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="my-3">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etitle"
                    name="etitle"
                    value={note.etitle}
                    aria-describedby="emailHelp"
                    onChange={onChange}//The onChange function updates the state of the note object whenever the user types in the form.
                    minLength={5}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="edescription"
                    name="edescription"
                    value={note.edescription}
                    onChange={onChange}
                    minLength={5}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="tag" className="form-label">
                    Tag
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etag"
                    name="etag"
                    value={note.etag}
                    onChange={onChange}
                    minLength={5}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
              ref={refClose}
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button disabled={note.etitle.length < 5 || note.edescription.length < 5} onClick={handleClick} type="button" className="btn btn-primary">
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-3">
  <h2>Your Notes</h2>
  <div className="container mx-2">
    {Array.isArray(notes) && notes.length === 0 ? 'No notes to display':''}
  </div>
  

  {Array.isArray(notes) && notes.length > 0 ? (
    notes.map((note,index) => (
      
        <Noteitem
          key={note._id || index}
          updateNote={updateNote}
          note={note}
          showAlert={props.showAlert}
        />
      
    ))
  ) : (
    <p>Loading notes...</p> // Optional: show a loading message while notes are being fetched
  )}
</div>

    </>
  );
}
//Otherwise, map through the notes array and render a Noteitem component for each note.
            //The updateNote function is passed down to Noteitem to handle editing.
//Invisible Button:
//A hidden button with d-none is used to trigger the Bootstrap modal. This button is clicked programmatically using ref.current.click() when the modal needs to be shown.
export default Notes;
