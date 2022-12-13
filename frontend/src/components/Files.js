import Button from '@mui/material/Button';
import axios from 'axios'
import {useState , useEffect} from "react"
import "./File.css"


const Fileupload = () => {
    const [getimg , setGetimg] = useState([])
    const [filepost , setFilepost] = useState('')
    const [fileUpdate , setFileUpdate] = useState("")


    function FilePost(e){
        setFilepost(e.target.files[0])
    }
    const maxSize= 1024 * 1024 * 2
    function Posthandler(e) {
        e.preventDefault()
        if(filepost.length===0 ){
         if(filepost.fileSize > maxSize)

            {
                alert("file size should be less then 2MB")
            }
            alert("File Must not be empty")
        }
       
        else{
            console.log(filepost);
            const formData = new FormData();
            formData.append('file',filepost);
            axios.post("http://localhost:9000",formData).then((res)=>{
                alert(res.data)
            });
            setFilepost("")
        }
    };

useEffect(()=>{
        axios.get("http://localhost:9000").then((res)=>{setGetimg(res.data) })
},[getimg])

function del(id){
    axios.delete(`http://localhost:9000/delete/${id}`).then((res)=> alert(res.data))
}

function FileUpdate(id){

if(fileUpdate.length===0){
            alert("File Must not be empty")
        }
        else{
            const formData = new FormData();
            formData.append('file',fileUpdate);
            axios.post(`http://localhost:9000/update/${id}`,formData).then((res)=>{
                alert(res.data)
            });
            setFileUpdate("")
        }
    };

const Serverhost = "http://localhost:9000/"

return ( 
    <>
    <div>
    <form onSubmit={Posthandler}>
    <Button variant="contained" >Upload<input  multiple onChange={FilePost} type="file"/></Button><br></br><br></br>
    <Button variant="outlined" type='submit' color="success">Click</Button>
    <input type="reset" value="Clear" />
    </form>
    <div className='file'>
    {
        getimg.map((im,index)=>
    <figure key={index} id="flex">
            <img src={Serverhost + im.filename} style={{ width: "10em", height: "10em" }} alt="....."></img><br></br><br></br>
            <Button variant="outlined"  color="success" component="label">Update<input  multiple onChange={(e)=>setFileUpdate(e.target.files[0])} type="file" required/></Button><br></br><br></br>
            <div>
            <Button variant="outlined"  color="success" onClick={()=>FileUpdate(im._id)} component="label">submit</Button><br></br><br></br>
            <Button variant="outlined"  color="success" onClick={()=>del(im._id)} component="label">Delete</Button>
            </div>
   
    </figure>
)}
   </div>
</div>
   
    </> 
    // {
    //     data.map((data)=>(


    //     ))
    // }
    );
}
 
export default Fileupload;