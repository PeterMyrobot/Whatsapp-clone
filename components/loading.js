import {Circle} from "better-react-spinkit"

function Loading() {
  return (
    <center style={{display: 'grid', placeItems: 'center', height:'100vh'}}>
      <div>
        <img
          src='https://seeklogo.com/images/W/whatsapp-icon-logo-6E793ACECD-seeklogo.com.png'
          alt=''
          style={{ marginBottom: 10 }}
          height={200}
        />
        <Circle color="#3CBC2B" size={60}/>
      </div>
    </center>
  );
}

export default Loading;
