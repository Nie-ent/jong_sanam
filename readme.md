JONG
===
### env guide
PORT=8000   
DATABASE_URL=mysql://user:password@host:port/database_name   
JWT_SECRET=your_super_secret_jwt_key   
LINE_CHANNEL_ACCESS_TOKEN=your_line_token   
LINE_CHANNEL_SECRET=your_line_secret   

---
###service

|path |method |authen |params |query |body |
|:-- |:-: |:-: |:-: |:-: |:-- |
|/api/auth/login |post |- |- |- |{email, password} |
|/api/auth/register |post |- |- |- |{email, password, firstName,lastName, inviteKey(optional)} |
|/api/auth/me |get |y |- |- |- |
|/api/admin/keys |get |y(Super) |- |- |- |
|/api/admin/keys |post |y(Super) |- |- |{roleToGrant} |
|/api/pitches |get |y |- |- |- |
|/api/pitches/:id |get |y |:id |- |- |
|/api/pitches |post |y |- |- |{displayName, type, hourlyRate, status} |
|/api/pitches/:id |put |y |:id |- |{displayName, type, hourlyRate} |
|/api/pitches/:id/status |patch |y |:id |- |{status} |
|/api/pitches/:id |delete |y |:id |- |- |
|/api/bookings |get |y |- |date,pich_id |- |
|/api/bookings/:id |get |y |:id |- |- |
|/api/bookings |post |- |- |- |{userId, pitchId, startTime, endTime} |
|/api/bookings/:id/status |patch |y |:id |- |{status} |
|/api/bookings/check |post |- |- |- |{date, time, pitchId} |
|/webhook |post |- |- |- |(LINE Payload) |
|/api/users/:lineUserId |get |- |:lineUserId |- |- |
|/api/users/:lineUserId |patch |- |:lineUserId |- |{displayName, phoneNumber} |


