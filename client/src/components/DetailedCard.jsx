import React from 'react'
import {Link} from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { FaHeart } from "react-icons/fa6";
import { FaShareAlt } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";

function DetailedCard() {
  return (
    <main className='card-container-wrap'>
      <Link to='#' className='back-arrow'>
        <IoIosArrowBack className='back'/>
        <div className='back-arrow-desc'>
          Back
        </div>
      </Link>
      <div className='card-container'>
        <div className='detailed-card-left'>
          <div className='detailed-card-image-container'>
            <img className='detailed-card-image' src="images/profile.jpg" alt="profile-image" />  
            <div className='detail-btn'>
              <button className='edit-btn'>
                <CiEdit className='edit' />
              </button>
              <button className='delete-btn'>
                <MdDeleteOutline  className='delete'/>
              </button>
              <button className='favourite-btn'>
              <FaHeart className='fav-icon' /> 
              </button>
              <button className='share-btn'>
                <FaShareAlt className='share'/>
              </button>
            </div>
          </div>
          <div className='desc'>
            <div className='person-name'>
              Daniel Otchere
            </div>
            <div className='occupations'>
              <div className='occupation1'>#Lawyer</div>
              <div class="vertical-line"></div>
              <div className='occupation2'>#Doctor</div>
            </div>
          </div>
          <div className='credentials'>  
            <div className='number-detail'>
              <div className='personal-number'>
                Personal-number
              </div>
              <div className='number'>
                034525235625
              </div>
            </div>
            <hr />
            <div className='email-detail'>
              <div className='personal-email'>
                Personal-email
              </div>
              <div className='email'>
                daniel@example.com
              </div>
            </div>
            <hr />
            <div className='home-detail'>
              <div className='home'>
                Home
              </div>
              <div className='home-address'>
                Accra, Ghana
              </div>
            </div>
          </div>
        </div>
        <div className="detailed-card-right">
          <div className='links-title'>
            Links
            <hr />
          </div>
          <Link to="">
            <img className='ref-link-image' style={{width:"55%",height:"55%",marginBottom:"-2px"}} src="images/email.png" alt="" />
            <div className='link-desc'>Email</div>
          </Link>
          <Link to="">
            <img className='ref-link-image' style={{width:"52%",height:"54%"}} src="images/twitter.png" alt="" />
            <div className='link-desc'>X</div>
          </Link>
          <Link to="">
            <img className='ref-link-image' style={{width:"60%",height:"60%"}} src="images/instagram.png" alt="" />
            <div className='link-desc'>
              Instagram
            </div>
          </Link>
          <Link to="">
            <img className='ref-link-image' style={{width:"50%",height:"50%",marginBottom:"6px"}} src="images/facebook.webp" alt="" />
            <div className='link-desc'>
              Facebook
            </div>
          </Link>
          <Link to="">
            <img className='ref-link-image' style={{width:"50%",height:"50%",marginBottom:"5px"}} src="images/whatsapp.png" alt="" />
            <div className='link-desc'>Whatsapp</div>
          </Link>
          <Link to="">
            <img className='ref-link-image' style={{width:"60%",height:"60%"}} src="images/linkedin.png" alt="" />
            <div className='link-desc'>
              LinkedIn
            </div>
          </Link>
        </div>
      </div>  
    </main>
  )
}

export default DetailedCard
