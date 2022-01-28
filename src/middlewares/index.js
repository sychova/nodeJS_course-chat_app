const path = require('path')
const express = require('express')

const publicDirPath = path.join(__dirname, '../../public')

module.exports = [express.static(publicDirPath)]
