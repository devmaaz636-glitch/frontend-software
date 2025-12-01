import React from 'react'
import user1 from "../../assets/images/users/user1.jpg";

const Sender = () => {
  return (
    <div className='d-flex justify-content-between gap-2 '>
            <div style={{ fontSize: "10px",backgroundColor:'rgba(211, 211, 211,0.4)' }} className='p-1 border'>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate magni nesciunt pariatur reiciendis voluptatem tenetur nostrum, quos maiores soluta suscipit.
            </div>
            <div>
                <img src={user1}
                    className="rounded-circle"
                    alt="avatar"
                    width="45"
                    height="45"
                />
            </div>
        </div>
  )
}

export default Sender
