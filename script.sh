echo '\n\n requesting all mages'
curl localhost:8000/mages

echo '\n\n requesting Radagast'
curl localhost:8000/mages/1

echo '\n\n requesting Gandalf'
curl localhost:8000/mages/2

echo '\n\n requesting with wrong body'
curl --silent -X POST \
--data-binary '{"invalid": "data"}' \
localhost:8000/mages

echo '\n\n creating saruman'
CREATE=$(curl --silent -X POST \
--data-binary '{ "name": "Saruman", "age": 120, "power": "DarkPower" }' \
localhost:8000/mages)

echo $CREATE

ID=$(echo $CREATE | jq .id)
echo $ID

echo '\n\n requesting Saruman'
curl localhost:8000/mages/$ID