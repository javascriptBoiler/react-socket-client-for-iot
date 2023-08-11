import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import {toast } from 'react-toastify';

import config from '../../config'
import Container from '../../component/Container'

const defaultDeviceIDs = ['123', '456', '789'];

const App = ({socket}) => {
  const [connectedDevice, setConnectedDevice] = useState([]);
  const [iotData, setIOtData] = useState([]);
  const [loadingDevice, setLoadingDevice] = useState(undefined);
  const navigate = useNavigate();

  const updateIOTData = (data) => {
    setIOtData((current) => {
      if (current.length === 0) {
        return([data]);
      }
      const isRecordAvailabe = current.find((each) => `${each.deviceId}` === `${data?.deviceId}`)
      if(isRecordAvailabe){
        return current.map((each)=>{
          if(`${each.deviceId}` === `${data.deviceId}`) {
            return data;
          } else {
            return each;
          }
        })
      } else {
        return([...current, data]);
      }
    })
  }

  useEffect(() => {
    if (socket) {
      socket.on('roomUpdate', (data) => {
        toast.success(`${data?.measure} updated`)
        setLoadingDevice(data?.deviceId);
        updateIOTData(data);
        setLoadingDevice(undefined);
      });

      return () => {
        defaultDeviceIDs.map((eachID)=>{
          socket.emit('unsubscribe', eachID);
        })
        socket.disconnect();
        setConnectedDevice([]);
        setIOtData([]);
      };
    }
  }, [socket]);

  const getDeviceLatestData = async (deviceID) => {
    setLoadingDevice(deviceID);
    await axios.get(`${config.BASE_URL}/api/measure/${deviceID}`)
    .then((response)=>{
      console.log('response::::::::::::::;', response.data);
      updateIOTData(response?.data);
    })
    .catch((e) => {
      console.log('error:::::::::::::;', e.message);
    })
    setLoadingDevice(undefined);
  }

  const connecttotheDevice = (currentDevice) => {
    socket.emit('subscribe', currentDevice);
    setConnectedDevice((pre) => ([...pre, currentDevice]))
    getDeviceLatestData(currentDevice);
  }

  const unsubscribeListing = (currentDevice) => {
    defaultDeviceIDs.map((currentDevice)=>{
      socket.emit('unsubscribe', currentDevice);
    })

    setIOtData((current) => current.filter((each)=> `${each.deviceId}` !== `${currentDevice}`))
    setConnectedDevice((current) => current.filter((each)=> `${each}` !== `${currentDevice}`))

  }

  return (
      <Container>
        {
          defaultDeviceIDs.map((eachID) => {
            if (connectedDevice.includes(`${eachID}`)){
              return (
                <DeviceDetails 
                  data={iotData?.find((each) => `${each?.deviceId}` === `${eachID}`)} 
                  loading={loadingDevice === `${eachID}`}
                  key={`device_${eachID}`}
                  unsubscribe={unsubscribeListing}
                />
              )
            } else {
              return(
                <ConnectPage 
                  deviceID={`${eachID}`} 
                  connect={connecttotheDevice}
                  key={`device_${eachID}`}
                />
              )
            }
          })
        }
        <div className='float-button' onClick={() => navigate('/create')}> + Update</div>
      </Container>
  );
};


export const ConnectPage = ({deviceID, connect}) => {
  return (
    <div id='mobile_device_before_connect'>
      <button onClick={() => connect(deviceID)}>Connect to {deviceID}</button>
    </div>
  )
}

export const DeviceDetails = ({data, loading, unsubscribe}) => {

  if (loading){
    return 'Loading...'
  }
  return (
    <div id='mobile_device'>
      <div id='device_after_connrcted'>
      
        <div class="grid-container">
          <div class="grid-item">Device ID</div>
          <div class="grid-item">{data?.deviceId}</div>
          <div class="grid-item">Measure</div>  
          <div class="grid-item">{data?.measure}</div>
          <div class="grid-item">Value</div>
          <div class="grid-item">{data?.value}</div>  
          <div class="grid-item">Date</div>
          <div class="grid-item">{moment(data?.time).format('MMMM Do YYYY')}</div>
          <div class="grid-item">Time</div>
          <div class="grid-item">{moment(data?.time).format('h:mm:ss a')}</div>
        </div>

        <button onClick={() => unsubscribe(data?.deviceId)}>Disconect from {data?.deviceId}</button>
      </div>
    </div>
  )
}


export default App;
