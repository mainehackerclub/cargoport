cargoport
=========

A Museum Exhibit built with Arduino, Node.js, Unreal Development Kit, and lots of love.

Install
=======

  * Git clone this repo on a system which will connect to the arduino and also a remote server
  * On the remote server
    * npm install node-static socket.io
    * run `node server.js`
  * On the arduino connected computer
    * npm install johnny-five
    * replace the hostname in cargo.js with the hostname or IP of your remote server
    * connect your arduino and load the standard firmata sketch.
    * run `node cargo.js`
  * visit your remote server's hostname to view the dashboard and control your arduino via the web
    * e.g. http://<hostname>:8081/dash.html
    * click the buttons on the web page and watch your arduino respond!

Special Thanks
==============

  * rwldrn's johnny-five project: https://github.com/rwldrn/johnny-five

License
=======

The MIT License (MIT)

Copyright (c) 2013 Maine Hacker Club

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
