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

        var startAt = attrs.startAt || 0;

        var startTimeout = parseInt( attrs.startTimeout ) || 0;

        var typeSpeed = parseInt( attrs.typeSpeed ) || 0;

        var backSpeed = parseInt( attrs.backSpeed ) || 0;

        var removeLine = attrs.removeLine || true;

        var endlineWait = attrs.endlineWait || 250;

        var endBackspace = attrs.endBackspace || true;

        // clear element
        elem.empty();

        /**
        * Simulate the backspace press for erasing text
        */
        function backspace(text, currPos) {

            // get a random type speed delay
            var delay = Math.round(Math.random() * (100 - 30)) + backSpeed;

            $timeout(function () {

                if( currPos == 0 ) {

                    if( startAt < strings.length -1 ) {

                        startAt++

                        return typeText( strings[startAt], 0 )

                    } else {

                        console.log('all strings finished');
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

                // if end of current string
                if( currPos == text.length ) {

                    /**
                    * At end of all lines run the end-callback
                    */
                    if( startAt == strings.length -1 ) {

                        // check if last line should be removed
                        if( endBackspace ) {

                            backspace(text, currPos);

                        }

                        // run the end callback if specified
                        if( angular.isFunction(scope.endCallback) ) {
                            return scope.$apply( scope.endCallback() )
                        }

                    } else {

                        if( removeLine ) {

                            backspace(text, currPos);

                        } else {

                            /**
                            * Run end-line timeout for next line
                            */
                            $timeout(function() {

                                startAt++
                                return typeText( strings[startAt], 0 )

                            }, endlineWait);

                        }


                    }

                    // move to next character to type
                } else {

                    var nextPos = currPos + 1;
                    var string = text.substr(0, nextPos)

                    // write new text
                    elem.text( string );

                    // type next
                    typeText( text, nextPos );
                }

            }, delay)

        }

        /**
        * Init the typing process
        * after wait for start wait timeout
        */
        $timeout(function() {

            // if valid function
            if( angular.isFunction(scope.startCallback) ) {
                scope.startCallback()
            }

            console.log( strings[startAt] );

            // start to write
            // at desired position
            return typeText( strings[startAt], 0 )

        }, startTimeout);

    }

})
