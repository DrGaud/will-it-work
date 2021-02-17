const axios = require('axios')
const addDays = require('date-fns/addDays')

function getDate(date = new Date()){
    return date.toJSON()
               .split('T')[0]
}
// Testing the structure of the JSON object is the way we expect
function test(){
    return axios
    .get(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${getDate()}&api_key=DEMO_KEY` 
    )
    .then(({data})=>{
        // Setting a testing date value
        const day = getDate(addDays(new Date(),1))

        //  this will also throw if we cant access the value
        let dayData = null
        try{
            dayData = data.near_earth_objects[day];
        }catch(e){
            throw new Error(
                'Erm, there was an Unexpected data structure that came back from the Fetch Request. We were looking for :root.near_earth_objects[array]: Instead we received:\n ' + e
                )
        }
        if(!dayData){
            throw new Error(`Variable dayDate is incorrect`)
        }
        const first = dayData[0]
        if (typeof first.is_potentially_hazardous_asteroid === 'undefined'){
            throw new Error(
                `
                Missing the key "is_potentially_hazardous_asteroid" from the first data point, as such we are presuming that the remaining data is wrong and incorrect.
                `
            )
        }
    })
}

test().catch((error)=>{
    console.log(`Nasa-Feed Test Failed: ${error.message}`)
    process.exit(1)
})