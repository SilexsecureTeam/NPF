import { ReactTyped } from "react-typed";

export default function Typing(){
  return(
   <>
    <h1 className=" text-4xl my-4 text-center text-black font-bold" >
    <ReactTyped strings={["The Hidden Tool Smart Bettors ",
      "Use to Outsmart the Bookmakers"]} typeSpeed={70} backSpeed={50} loop />
    </h1>
   </>
  )
}

