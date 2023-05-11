import React, {createContext, useState} from 'react';

export const AudioContext = createContext();

const AudioContextProvider =(props)=> {
const [audio, setaudio] = useState('yy')
const data={audio, setaudio}
    return (
      <AudioContext.Provider
        value={data}
        >
        {props.children}
      </AudioContext.Provider>
    );
}
export default AudioContextProvider;
