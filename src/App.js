import React from 'react';
import './App.css';
import QuizForm from './QuizForm';

class App extends React.Component {

  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className="App">
        <QuizForm></QuizForm>
      </div>
    );
  }
  
}

export default App;
