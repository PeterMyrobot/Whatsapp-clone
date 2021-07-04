import {Circle} from "better-react-spinkit"
import Image from "next/image"

function Loading() {
  return (
    <center style={{display: 'grid', placeItems: 'center', height:'100vh'}}>
      <div>
        <Image
          src='/icon.svg'
          alt=''
          style={{ marginBottom: 10 }}
          height={200}
          width={200}
        />
        <Circle color="#3CBC2B" size={60}/>
      </div>
    </center>
  );
}

export default Loading;
