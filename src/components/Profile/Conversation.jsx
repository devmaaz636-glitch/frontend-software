import React, { lazy } from 'react'
import { Card, CardBody, CardTitle } from "reactstrap";
const Receiver = lazy(() => import("./Receiver"))
const Sender = lazy(() => import("./Sender"))

const Conversation = () => {
    return (
        <div className='p-3'>
            <Card>
                <CardBody>
                    <CardTitle tag={'h5'} className='fw-bold'>Conversations</CardTitle>
                    <div className='d-flex flex-column  gap-2'>
                        <Receiver />
                        <Sender />
                        <Receiver />
                        <Sender />
                        <Receiver />
                        <Sender />
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}

export default Conversation
