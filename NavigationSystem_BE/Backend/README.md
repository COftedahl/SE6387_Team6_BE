This Navigation System runs an HTTP server hosting an OSRM routing backend. 

Different pre-processed datasets are available in the data/ folder. 

Start the server using the following command from within the data/terminal-d-wider-15/ folder: 

<pre>docker run -t -i -p 5003:5000 -v "%cd%:/data" ghcr.io/project-osrm/osrm-backend osrm-routed --algorithm mld /data/terminal-d-wider_15.osrm</pre>

Alternatively, start the server by accessing the route /nav/start on the node.js server, which can be started with <pre>npm start</pre>

Then, access the backend routing service through localhost:5003; example URLs include: 

- http://localhost:5003/nearest/v1/foot/-97.0390433,32.8877509?number=3

For more information on request URL format, see https://project-osrm.org/docs/v5.24.0/api/?language=cURL. 