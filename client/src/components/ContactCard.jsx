import React from 'react'
import { Link } from 'react-router-dom';
import { FaHeart } from "react-icons/fa6";

function ContactCard() {
 
  return (
    <main className='card-grid'>
      <div className='card-wrap'>
        <div className='btn-layer'>
          <div>
            <FaHeart className='heart-icon2' />
          </div>
          <Link to="/detail" className="view-link">View</Link>
        </div>
        <div className='card-image-wrap'>
          <div className='card-image'>
            <img src="" alt="" />
            <div className='alpha'>
              D
            </div>
          </div>
        </div>
        <div className='card-desc'> 
          <div>Daniel Otchere</div>
          <div>user@example.com</div>
        </div>
      </div>
      <div className='card-wrap'>
        <div className='btn-layer'>
          <div>
            <FaHeart className='heart-icon2' />
          </div>
          <Link to='/detail' className='view-link'>View</Link>
        </div>
        <div className='card-image-wrap'>
          <div className='card-image'>
            <img src="" alt="" />
            <div className='alpha'>
              D
            </div>
          </div>
        </div>
        <div className='card-desc'> 
          <div>Daniel Otchere</div>
          <div>user@example.com</div>
        </div>
      </div>
      <div className='card-wrap'>
        <div className='btn-layer'>
          <div>
            <FaHeart className='heart-icon2' />
          </div>
          <Link to='/detail' className='view-link'>View</Link>
        </div>
        <div className='card-image-wrap'>
          <div className='card-image'>
            <img src="" alt="" />
            <div className='alpha'>
              D
            </div>
          </div>
        </div>
        <div className='card-desc'> 
          <div>Daniel Otchere</div>
          <div>user@example.com</div>
        </div>
      </div>
      <div className='card-wrap'>
        <div className='btn-layer'>
          <div>
            <FaHeart className='heart-icon2' />
          </div>
          <Link to='/detail' className='view-link'>View</Link>
        </div>
        <div className='card-image-wrap'>
          <div className='card-image'>
            <img src="" alt="" />
            <div className='alpha'>
              D
            </div>
          </div>
        </div>
        <div className='card-desc'> 
          <div>Daniel Otchere</div>
          <div>user@example.com</div>
        </div>
      </div>
      <div className='card-wrap'>
        <div className='btn-layer'>
          <div>
            <FaHeart className='heart-icon2' />
          </div>
          <Link to='/detail' className='view-link'>View</Link>
        </div>
        <div className='card-image-wrap'>
          <div className='card-image'>
            <img src="" alt="" />
            <div className='alpha'>
              D
            </div>
          </div>
        </div>
        <div className='card-desc'> 
          <div>Daniel Otchere</div>
          <div>user@example.com</div>
        </div>
      </div>
    </main>
  )
}

export default ContactCard;