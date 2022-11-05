import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import {client, getProfiles, getPublications} from '../../api'
import Image from 'next/image'
import ABi from '../../abi.json'
import { ethers } from 'ethers'
function Profile() {
    const router = useRouter()
    const {id} = router.query
    const [Profile, setProfile] = useState()
    const [Pubs, setPubs] = useState([])
    const address = '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d'
    useEffect(() => {
      fetchProfile()
    }, [id])

    const fetchProfile = async()=>{
        try{
            const response  = await client.query(getProfiles, {id}).toPromise()
            setProfile(response.data.profiles.items[0])
            const publicationsData = await client.query(getPublications,{id}).toPromise()
            setPubs(publicationsData.data.publications.items)
        }catch(e){
           console.log(e)
        }
    }

    const connectWallet = async()=>{
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        })
    }
    const followUser = async()=>{
       const provider =  new ethers.providers.Web3Provider(window.ethereum)
       const signer = provider.getSigner()
       const contract = new ethers.Contract( address, ABi, signer)
       try {
        const tx = await contract.follow(
            [id], [0x0]
        )
        await tx.wait()
        console.log("Followed user Succefully")
       } catch (error) {
        console.log(error)
       }
    }
    if(!Profile) return null
  return (
    <div>
        {
            Profile.picture ?(
             <Image src={Profile.picture.original.url} width='200px' height='200px'/>
            ):(<div style= {{width:'200px', height:'200px',backgroundColor:'black' }}>
                </div>)
        }
        <button onClick={connectWallet}>Connect Wallet</button>
        <div>
            <h4>{Profile.handle}</h4>
            <p>{Profile.bio}</p>
            <p>Total Followers: {Profile.stats.totalFollowers}</p>
            <p>Total Followings: {Profile.stats.totalFollowing}</p>
            <button onClick={followUser}>Follow User</button>
            <div >
                {
                    Pubs.map((pub, index)=>(
                        <div key={index} style={{padding:'20px' , borderTop:'1px solid #ededed'}}>
                         {pub.metadata.name}
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default Profile