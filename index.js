const express = require("express")
const app = express();

const admin = require("firebase-admin");
const cred = require("./cred.json");

admin.initializeApp({
    credential: admin.credential.cert(cred)
})

const db = admin.firestore();

app.use(express.json());

app.use(express.urlencoded({extended: true}))

const PORT = process.env.PORT || 8080;

app.post("/location", async(req, res) => {
    try{
        const deviceId = req.body.deviceId;
        const time = req.body.time;
        const locationDataJson = {
            time: req.body.time,
            longitude: req.body.longitude,
            latitude: req.body.latitude,
        }
        const response = db.collection(deviceId).doc(time).set(locationDataJson);
        res.send(response)
    }
    catch(e){

        res.send(e)
    }
})

app.get('/location/:id', async(req,res)=>{
    try{
        const locationRef = db.collection(req.params.id);
        const response = await locationRef.get();
        let responseArr = [];
        response.forEach(doc => {
            responseArr.push(doc.data());
        })

        res.send(responseArr)
    }catch(error){
   
        res.send(error)
    }
})

app.get('/location/create/:deviceId/:time/:latitude/:longitude', async(req, res) => {
    const deviceId = req.params.deviceId;
    const time = req.params.time;
    const longitude = req.params.longitude;
    const latitude = req.params.latitude;

    try{
        const locationDataJson = {
            time: time,
            longitude: longitude,
            latitude: latitude,
        }
        const response = db.collection(deviceId).doc(time).set(locationDataJson);
        res.send(response)
    }
    catch(e){
        res.send(e)
    }
    
})

app.listen(PORT, () => {
    console.log(`Server Runing on PORT ${PORT}.`)
})