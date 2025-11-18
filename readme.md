JONG
===

service  
---

|path |method |authen |params |query |body |note |
|:-- |:-: |:-: |:-: |:-: |:-- |:-: |
|/api/auth/login |post |- |- |- |{email, password} |
|/api/auth/register |post |- |- |- |{email, password, firstName,lastName, inviteKey(optional)} |
|/api/auth/me |get |y |- |- |- | 
|/api/admin/keys |get |y(Super) |- |- |- |(Optional)|
|/api/admin/keys |post |y(Super) |- |- |{roleToGrant} |(Optional)|
|/api/pitches |get |y |- |- |- |
|/api/pitches/:id |get |y |:id |- |- |
|/api/pitches |post |y |- |- |{name, type, hourlyRate, status} |
|/api/pitches/:id |put |y |:id |- |{name, type, hourlyRate} |
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

---
