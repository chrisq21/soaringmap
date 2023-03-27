This is a starter template for [Learn Next.js](https://nextjs.org/learn).

Generate static image
curl -g "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/-112.1614,33.0845,12,0,60/400x400?padding=50,10,20&access_token=pk.eyJ1IjoiY2hyaXNxMjEiLCJhIjoiY2wyZTB5bmFqMTNuYjNjbGFnc3RyN25rbiJ9.4CAHYC8Sic49gsnwuP_fmA" --output example-mapbox-static-bbox-2.png


curl -g "https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/[-77.043686,38.892035,-77.028923,38.904192]/400x400?padding=50,10,20&access_token=pk.eyJ1IjoiY2hyaXNxMjEiLCJhIjoiY2wyZTB5bmFqMTNuYjNjbGFnc3RyN25rbiJ9.4CAHYC8Sic49gsnwuP_fmA" --output example-mapbox-static-bbox-2.png

curl -g "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/-112.1614,33.0845,12,45,60/600x600?access_token=pk.eyJ1IjoiY2hyaXNxMjEiLCJhIjoiY2wyZTB5bmFqMTNuYjNjbGFnc3RyN25rbiJ9.4CAHYC8Sic49gsnwuP_fmA" --output example-mapbox-static-3.png