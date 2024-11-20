const fs = require ("fs")
const os = require ("os")

console.log(os.cpus().length, "12")


fs.writeFileSync("text.txt", "Hello world")
fs.appendFileSync("text.txt", `Hey there\n`)
fs.cpSync ("text.txt", "copy.txt")
fs.unlinkSync ( "copy.txt")

console.log(fs.statSync ("text.txt"))


const Read = fs.readFileSync ( "contact.tsx", "utf8")



console.log(Read)
