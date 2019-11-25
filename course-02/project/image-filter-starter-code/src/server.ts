import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  //image filter end point
  app.get("/filteredimage?:image_url",async(req,res)=>{
    let imageUrl = req.query.image_url
    if (!imageUrl) {
      return res.status(400).send({ message: 'Image url is required' });
  }
    const filteredFile = await filterImageFromURL(imageUrl);
    res.status(200).sendFile(filteredFile)
    res.on('finish', function() {
      try {
        deleteLocalFiles([filteredFile]) 
      } catch(e) {
        console.log("Error deleting ", filteredFile); 
      }
  });
    
  })

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();