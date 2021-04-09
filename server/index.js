const express = require('express')
const { join } = require('path')

const app = express();
app.use(express.static(join(__dirname, '..'), {
    lastModified: false,
    dotfiles: 'deny'
}))
app.listen(process.env.PORT || 3000)
