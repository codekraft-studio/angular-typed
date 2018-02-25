# angular-typed
the angularjs typing tool module, that helps you with typing animation

### [DEMO](https://codekraft-studio.github.io/angular-typed/)


### Getting started:

Download the package from GitHub.
```bash
git clone https://github.com/codekraft-studio/angular-typed.git
```
or using npm:
```bash
npm install angular-typed
```
Or use it from the GitHub CDN wich point to the last updated file:
```html
<script type="text/javascript" src="https://cdn.rawgit.com/codekraft-studio/angular-typed/master/dist/angular-typed.min.js"></script>
```

Add __angular-typed__ to your module dependencies:
```javascript
angular.module('app', ['angular-typed'])
```
and you can start using the __typed__ directive in your app!

## Example
The source code that create the demo page:
```html
<div class="type-box"
start-timeout="2000"
start-callback="myStartCallback()"
end-callback="myCallback()"
type-speed="20"
back-speed="20"
type-strings="[
    '<b>Hey!</b>^350 How are you?^500',
    'Welcome to ^500<strong>angular-typed</strong>!^1000',
    'This fantastic tool will help you^500',
    'with the <i>typing animations in angularjs</i>!^1000',
    '^1000',
    'It is <u>very easy</u> to use^500',
    'it supports <code>html markup</code>^750 and timings^500',
    '^250Have a try in you app!^2000',
    'and <strong>best of all</strong>^400.^500.^550.^550is free!'
]" html-mode typed></div>
```

---

### How it works

There are two main ways to use the __typed__ directive:

**Method 1:** as a element.
	Write some text in the typed element and it will be typed when the page is loaded.

```html
<typed>You can make it type what you want..</typed>
```

**Method 2:** as a attribute.
	Place the typed attribute where you want and it will type what is inside the element.

```html
<div typed>..this text will be typed when the page is loaded..</div>
```

---

### Customizations
You can pass all of this extra attributes in the element that contain the __typed__ directive.

*	**type-speed**: The typing animation speed (in millis) // default 0
*	**back-speed**: The backspace animation speed (in millis) // default 0
*	**html-mode**: Enable the html parse mode // default false
*	**start-line**: The line to start typing // default 0
*	**start-timeout**: The start timeout delay // default 0
* 	**remove-line**: Delete each line after is been typed // default true
* 	**remove-last**: Delete the last line when the typing animation ends // default false
*	**loop**: Enable the loop at the end of the strings // default false
*	**cursor**: A string that will be used as cursor (Default: '|')

---

### Development

For the development mode, go to the project folder, install all the dependencies by typing:
```bash
npm install
```
Than the gruntfile is preconfigured with two basic tasks:
```bash
grunt watch // watch file changes and rebuild
grunt build // build the dist package
```
