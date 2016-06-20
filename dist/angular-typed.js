angular.module('angular-typed', [])

.directive('typed', function($log, $timeout, $q) {

    var _scope = {
        typeStrings: '=?',
        startCallback: '&',
        endCallback: '&'
    }

    var directive = {
        restrict: 'AE',
        replace: false,
        scope: _scope,
        link: _link
    }

    return directive

    function _link(scope, elem, attrs) {

        // get strings to type
        var strings = scope.typeStrings || ( elem.text() ? [elem.text().trim().replace(/\s+/g, ' ')] : null );

        // if no strings exit
        if( !strings ) {
            $log.info( 'angular-typed: No strings to type found on element: ', elem[0] );
            return;
        }

        var startLine = attrs.startLine || 0;

        var currentLine = startLine;

        var startTimeout = parseInt( attrs.startTimeout ) || 0;

        var loop = 'loop' in attrs && attrs.loop != 'false';

        var typeSpeed = parseInt( attrs.typeSpeed ) || 0;

        var backSpeed = parseInt( attrs.backSpeed ) || 0;

        var removeLine = attrs.removeLine || true;

        var endlineWait = attrs.endlineWait || 250;

        var endBackspace = attrs.endBackspace || false;

        var cursor = angular.element( document.createElement('span') ).addClass('typed-cursor').text( '|' );

        // clear element
        elem.empty();

        // append cursor
        elem.append(cursor);

        /**
         * Create a new line for the text to type
         */
        function newLine(first) {
            var line = angular.element( document.createElement('span') ).addClass('typed-line');
            first ? elem.prepend(line) : elem.append(line);
            elem = line;
        }

        /**
        * Simulate the backspace press for erasing text
        */
        function backspace(text, currPos) {

            // get a random type speed delay
            var delay = Math.round(Math.random() * (100 - 30)) + backSpeed;

            $timeout(function () {

                if( currPos == 0 ) {

                    if( currentLine < strings.length -1 ) {

                        currentLine++

                        return typeText( strings[currentLine], 0 )

                    } else {

                        // At the end of all run the callback if
                        // specified and check if loop mode is enabled
                        if( angular.isFunction(scope.endCallback) ) {
                            // apply the user callback
                            scope.$apply( scope.endCallback() );
                        }

                        // if loop mode is enabled
                        // reset currentLine to starting line
                        // and loop it !
                        return loop ? startTyping() : null;

                    }


                } else {

                    var nextPos = currPos - 1;
                    var string = text.substr(0, nextPos)

                    // write new text
                    elem.text( string );

                    // type next
                    backspace( text, nextPos );

                }

            }, delay);

        }

        /**
        * Simulate the typing process
        */
        function typeText(text, currPos) {

            // get a random type speed delay
            var delay = Math.round(Math.random() * (100 - 30)) + typeSpeed;

            $timeout(function() {

                var charPause = 0;
                var substr = text.substr(currPos);

                // check for any user defined pause
                if (substr.charAt(0) === '^') {

                    var skip = 1; // skip atleast 1

                    if (/^\^\d+/.test(substr)) {
                        substr = /\d+/.exec(substr)[0];
                        skip += substr.length;
                        charPause = parseInt(substr);
                    }

                    // strip out the escape character and pause value so they're not printed
                    text = text.substring(0, currPos) + text.substring(currPos + skip);
                }

                $timeout(function () {

                    // if end of current string
                    if( currPos == text.length ) {

                        /**
                        * At end of all lines run the end-callback
                        */
                        if( currentLine == strings.length -1 ) {

                            // check if last line should be removed
                            if( endBackspace ) {

                                backspace(text, currPos);

                            } else {

                                // At the end of all run the callback if
                                // specified and check if loop mode is enabled
                                if( angular.isFunction(scope.endCallback) ) {
                                    // apply the user callback
                                    scope.$apply( scope.endCallback() );
                                }

                                // if loop mode is enabled
                                // reset currentLine to starting line
                                // and loop it !
                                return loop ? startTyping() : null;
                            }

                        } else {

                            if( removeLine ) {

                                backspace(text, currPos);

                            } else {

                                /**
                                * Run end-line timeout for next line
                                */
                                $timeout(function() {

                                    currentLine++
                                    return typeText( strings[currentLine], 0 )

                                }, endlineWait);

                            }

                        }

                    /**
                    * Move to the next character
                    * that need to be typed
                    * (still the same line)
                    */
                    } else {

                        var nextPos = currPos + 1;
                        var string = text.substr(0, nextPos)

                        // write new text
                        elem.text( string );

                        // type next
                        typeText( text, nextPos );
                    }

                }, charPause);

            }, delay);

        }

        /**
         * Start the typing animation
         */
        function startTyping(first) {

            $timeout(function () {

                // if valid function
                if( first && angular.isFunction(scope.startCallback) ) {
                    scope.startCallback();

                    // TODO: for multi-line purpose move this function
                    // outside this if statement and do some logic

                    // make new line (true for first line)
                    newLine(true);
                }

                // reset current line with original start line
                currentLine = startLine;
                // start everything
                return typeText( strings[currentLine], 0 );

            }, startTimeout);

        }

        // start
        return startTyping(true);
    }

})
