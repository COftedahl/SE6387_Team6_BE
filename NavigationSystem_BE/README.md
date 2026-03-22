This Navigation System runs an HTTP server hosting an OSRM routing backend. 

Different pre-processed datasets are available in the data/ folder. 

Start the server using the following command from within the data/terminal-d-wider-15/ folder: 

<pre>docker run -t -i -p 5002:5000 -v "%cd%:/data" ghcr.io/project-osrm/osrm-backend osrm-routed --algorithm mld /data/terminal-d-wider_15.osrm</pre>