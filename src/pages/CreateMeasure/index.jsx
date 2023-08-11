import React, {useState} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {toast } from 'react-toastify';

import './index.css';
import config from '../../config'
import Container from '../../component/Container'

const MEASUREMENT = [
    {
        id: '123',
        name: 'Temperature'
    },
    {
        id: '456',
        name: 'Humidity'
    },
    {
        id: '789',
        name: 'Pressure'
    }
]
export default function Index() {

  const [selectedData, setSelectedData] = useState(MEASUREMENT[0])
  const [updatedValue, setUpdatedValue] = useState(undefined)
  const navigate = useNavigate();

  const setChange = (e) => {
    const selectedValue = MEASUREMENT.find((each) => each?.id === e.target.value);
    setSelectedData(selectedValue);
  }

  const submitTheValues = async (e) => {
      e.preventDefault();
    await axios.patch(`${config.BASE_URL}/api/measure/${selectedData?.id}`, {
        deviceId: selectedData?.id,
        measure: selectedData?.name,
        value: updatedValue
    })
    .then(()=>{
        toast.success('Measurement updated successfully')
    })
    .catch((e) => {
        toast.error(e.message)
    })
  }

  return (
    <Container>
      <form id="contact" action="" method="post" onSubmit={submitTheValues}>
        <h3>Update Measurement</h3>
        <h4>Display and update this measurement in real-time on the device</h4>
        <fieldset>
            <select name="measure_id" id="measure_select_id" onChange={setChange}>
                {
                    MEASUREMENT.map((each) => <option value={each.id} selected={selectedData?.id === each.id}>{each.name}</option>)
                }
            </select>
        </fieldset>

        <fieldset>
        <input placeholder="Your Current ID" type="text" tabindex="2" disabled value={selectedData?.id}/>
        </fieldset>

        <fieldset>
        <input placeholder="Update Measurement Value" type="text" tabindex="3" required onChange={(e)=>setUpdatedValue(e.target.value)}/>
        </fieldset>

        <fieldset>
        <button name="submit" type="submit" id="contact-submit" data-submit="...Sending">Submit</button>
        </fieldset>


    </form>
    </Container>
  )
}
