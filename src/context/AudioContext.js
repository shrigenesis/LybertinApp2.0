import React, {createContext, useState} from 'react';

export const AudioContext = createContext();

const AudioContextProvider =(props)=> {
const [audio, setaudio] = useState('')
const [isdisabled, setisdisabled] = useState(false)
const [oldDate, setoldDate] = useState('gg')
const data={audio, setaudio, isdisabled, setisdisabled, oldDate, setoldDate}
    return (
      <AudioContext.Provider
        value={data}
        >
        {props.children}
      </AudioContext.Provider>
    );
}
export default AudioContextProvider;
