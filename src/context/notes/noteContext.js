import { createContext } from "react";

const noteContext = createContext();

export default noteContext;

/*
What is createContext?
createContext is a React function used to create a Context.
A Context in React allows you to share data (state, functions, or other values) globally across the component tree without having to pass props manually at every level.
It is primarily used for managing global or shared state in React applications.
 avoiding the need for prop drilling.
*/