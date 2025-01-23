import { $ } from "bun";


const before_space = await $`df -h --total | grep /dev/mapper`.text()


console.log('------------------- Cleaning... Docker -------------------')
await $`docker system prune -a -f`;
await $`docker inspect --format='{{.LogPath}}' $(docker ps -q) | xargs -I {} sudo truncate -s 0 {}`;


console.log('------------------- Cleaning... System -------------------')
await $`sudo journalctl --vacuum-size=500M`;
await $`sudo sh -c 'echo > /var/log/syslog'`;


console.log('------------------- Cleaning... Terraform -------------------')
await $`cd ${process.env.HOME}/github; sudo find . -name ".terraform" -type d -prune -exec rm -rf '{}' +`;
await $`cd ${process.env.HOME}/gitlab; sudo find . -name ".terraform" -type d -prune -exec rm -rf '{}' +`;

console.log('------------------- Cleaning... Node Module -------------------')
await $`cd ${process.env.HOME}/github; sudo find . -name "node_modules" -type d -prune -exec rm -rf '{}' +`;
await $`cd ${process.env.HOME}/gitlab; sudo find . -name "node_modules" -type d -prune -exec rm -rf '{}' +`;

const after_space = await $`df -h --total | grep /dev/mapper`.text()

console.log('------------------- before running cleanning script -------------------')
console.log(before_space)
console.log('------------------- after running cleanning script -------------------')
console.log(after_space)
