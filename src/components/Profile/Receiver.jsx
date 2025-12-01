import React from 'react'
import user1 from "../../assets/images/users/user1.jpg";

const Receiver = () => {
    return (
        <div className='d-flex justify-content-between gap-2 '>
            <div>
                <img src={user1}
                    className="rounded-circle"
                    alt="avatar"
                    width="45"
                    height="45"
                />
            </div>
            <div style={{ fontSize: "10px", }} className='p-1 border'>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate magni nesciunt pariatur reiciendis voluptatem tenetur nostrum, quos maiores soluta suscipit.
            </div>
        </div>
    )
}

export default Receiver
