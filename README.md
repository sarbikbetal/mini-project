# API for Mini Project - Disaster Reporting App

URL : `https://srbk-mini-project.herokuapp.com/`

## User Routes

+ POST `/user/signup`

Send a json body with header `Content-Type` as `application/json`

Sample

```json
{
  "licence": "AB/150/GH",
  "name": "Bro Code",
  "psswd": "iambro",
  "address": "Lucknow, Uttar Pradesh, India",
  "contact": "9568741235"
}
```

+ POST `/user/signin`

Send a json body with header `Content-Type` as `application/json` and only the `licence` and `psswd` (Password)

Sample

```json
{
  "licence": "AB/150/GH",
  "psswd": "iambro"
}
```
