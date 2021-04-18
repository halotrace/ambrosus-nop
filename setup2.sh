#!/bin/bash

apt-get update
apt install -y curl
apt install -y python-dev
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
apt-get install -y build-essential
apt-get install -y nodejs
apt install -y git
apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
apt update
apt install -y docker-ce
curl -L https://github.com/docker/compose/releases/download/1.22.0/docker-compose-"$(uname -s)"-"$(uname -m)" -o /usr/local/bin/docker-compose
apt install -y jq
npm install -g yarn
sudo chmod +x /usr/local/bin/docker-compose
git clone https://github.com/ambrosus/ambrosus-nop.git
wget https://nop.ambrosus.io/setup2.sh
chmod +x setup2.sh
cd ambrosus-nop || return
yarn install
yarn build
yarn start

getvar() {
  jq -r ".$2" <"$1" | tr '[:upper:]' '[:lower:]'
}

setVar() {
  result=$(jq ". + {\"$2\": \"$3\"}" <"$1")
  echo "$result" >"$1"
}

sent=$(getvar state.json sent)

if [ "$sent" == "true" ]; then
  echo "Onboard request already sent."
  return
fi

email=$(getvar state.json email)
role=$(getvar state.json role)
address=$(getvar state.json address)
network=$(getvar state.json network.name)
TOS=$(tail -n 1 ./output/TOS.txt)
tosHash=$(getvar state.json termsOfServiceHash)
tosSignature=$(getvar state.json termsOfServiceSignature)

if [ "$email" == "" ] || [ "$role" == "" ] || [ "$address" == "" ] || [ "$network" == "" ] || [ "$TOS" == "" ] || [ "$tosHash" == "" ] || [ "$tosSignature" == "" ]; then
  cd ..
  echo "One or more mandatory parameters has not been set."
  echo "Please restart process and fill all required information."
  return
fi

if [ "$email" == "null" ] || [ "$role" == "null" ] || [ "$address" == "null" ] || [ "$network" == "null" ] || [ "$TOS" == "null" ] || [ "$tosHash" == "null" ] || [ "$tosSignature" == "null" ]; then
  cd ..
  echo "One or more mandatory parameters has not been set."
  echo "Please restart process and fill all required information."
  return
fi

{
  echo Address: "$address"
  echo Network: "$network"
  echo Role: "$role"
  echo Email: "$email"
  echo TOS: "$TOS"
  echo tosHash: "$tosHash"
  echo tosSignature: "$tosSignature"
} >>info.txt

role=$(echo "$role" | awk -F " " '{ print $1 }')

if [ "$role" == "apollo" ]; then
  {
    echo IP: "$(getvar state.json ip)"
    echo Stake: "$(getvar state.json apolloMinimalDeposit)"
  } >>info.txt
fi

if [ "$role" == "atlas" ] || [ "$role" == "hermes" ]; then
  {
    echo URL: "$(getvar state.json url)"
  } >>info.txt
fi

if curl -X POST --data-urlencode "payload={\"attachments\": [{\"title\":\"$email-request\",\"text\":\"$(cat info.txt)\"},]}" https://register.ambrosus.io; then
  setVar state.json sent true
fi