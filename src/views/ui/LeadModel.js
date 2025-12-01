import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { createteamLeaders} from '../../features/userApis';

const Models= ({setFetchLatestUser}) => {
    const [modal, setModal] = useState(false);
    const [leadname,setleadname] = useState('')
    const toggle = () => setModal(!modal);

    const handlerteamLeaders = async () => {
        let details = {leadname:leadname}
        if(leadname.trim() === ''){
            alert("fill field!")
            return
        }
        const {data} = await createteamLeaders(details)
        if(data.success){
            alert('Added!')
            setFetchLatestUser(true)
            setleadname('')
        }
    }


  return (
    <div>
      <Button onClick={toggle}style={{backgroundColor:'#FFBC34',border:'1px solid #FFBC34',padding:'0'}}>
        <i class="bi bi-plus-square"style={{fontSize:'18px',cursor:'pointer',color:"#000"}}></i>
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Add user</ModalHeader>
        <ModalBody>
        <Form>
              <FormGroup>
                <Label for="username">Lead Name</Label>
                <Input
                  id="username"
                  name="name"
                  placeholder="Enter Agent Name"
                  type="name"
                  value={leadname}
                  onChange={(e) => setleadname(e.target.value)}
                />
              </FormGroup>
              </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => {
                handlerteamLeaders()
                toggle()
            }}>
            Submit
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default Models;