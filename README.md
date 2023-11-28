# Home Server Backend

A waste of time backend api server for the front end Vue.js ap.


# Endpoints

| Endpoint | Use |
|---|---|
| /api/google/talk | Speaks input to google speaker |
| /api/google/translate | Fun Translation |
| /api/google/time | Says the time |
| /api/nhl/leafs | Says when the next Leaf game is |
| /api/nhl/raptors | Says when the next Raptor game is |
| /api/birthday | A list of birthdays |
| /api/birthday | Says the next set of birthdays coming up if soon |
| /api/content/quotes | All quotes |
| /api/content.quotes/random | Says a random quote |

# Run

`node app.js`

or 

`npm run start`

# Dev mode

`npm run dev`

# Env Vars

| Name | Required / Default | Purpose |
|---|---|---|
| PORT | `8181` | The port to run on |
| GOOGLE_IP | Yes | The IP address of the google speaker |
| fileStore | Yes | The path to the directory of the content | 
