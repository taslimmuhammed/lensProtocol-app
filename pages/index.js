import { useState, useEffect } from "react";
import { client, recommendedProfile, } from "../api";
import Link from "next/link";
import Image from 'next/image'
export default function Home(){
  const [Profiles, setProfiles] = useState([])
  useEffect(() => {
    fetchProfiles()
  }, [])
  
  const fetchProfiles=async()=>{
    try{
      const response =await client.query(recommendedProfile).toPromise()
      console.log(response.data.recommendedProfiles)
      setProfiles(response.data.recommendedProfiles)
    }catch(e){

    }
  }
  return (<div>
   {
    Profiles.map((profile, index)=>(
      <Link href={`/profiles/${profile.id}`} key={index}>
      <a><div>
        {profile.picture? ( 
          profile.picture.original &&
        <Image
        src={profile.picture.original.url}
        width = "60px"
        height="60px"/>):(<div></div>)}
        <h1>{profile.handle}</h1>
        <p>{profile.bio}</p>
        </div></a>
      </Link>
    ))
   }
  </div>)
}