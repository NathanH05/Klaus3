/*! Carter Digital - v1.0.0 - 2015-05-05 */;
(function($) {

    /* global variables */
    var scrollbarNumber = 0;
    var xScrollDistance = 0;
    var yScrollDistance = 0;
    var scrollIntervalTime = 10;
    var scrollbarDistance = 0;
    var isTouch = 'ontouchstart' in window;
    var supportsOrientationChange = 'onorientationchange' in window;
    var isWebkit = false;
    var has3DTransform = false;
    var isIe7 = false;
    var isIe8 = false;
    var isIe9 = false;
    var isIe = false;
    var isGecko = false;
    var grabOutCursor = 'pointer';
    var grabInCursor = 'pointer';
    var onChangeEventLastFired = new Array();
    var autoSlideTimeouts = new Array();
    var iosSliders = new Array();
    var iosSliderSettings = new Array();
    var isEventCleared = new Array();
    var slideTimeouts = new Array();
    var activeChildOffsets = new Array();
    var activeChildInfOffsets = new Array();
    var infiniteSliderOffset = new Array();
    var sliderMin = new Array();
    var sliderMax = new Array();
    var sliderAbsMax = new Array();
    var touchLocks = new Array();

    /* private functions */
    var helpers = {

        showScrollbar: function(settings, scrollbarClass) {

            if (settings.scrollbarHide) {
                $('.' + scrollbarClass).css({
                    opacity: settings.scrollbarOpacity,
                    filter: 'alpha(opacity:' + (settings.scrollbarOpacity * 100) + ')'
                });
            }

        },

        hideScrollbar: function(settings, scrollTimeouts, j, distanceOffsetArray, scrollbarClass, scrollbarWidth, stageWidth, scrollMargin, scrollBorder, sliderNumber) {

            if (settings.scrollbar && settings.scrollbarHide) {

                for (var i = j; i < j + 25; i++) {

                    scrollTimeouts[scrollTimeouts.length] = helpers.hideScrollbarIntervalTimer(scrollIntervalTime * i, distanceOffsetArray[j], ((j + 24) - i) / 24, scrollbarClass, scrollbarWidth, stageWidth, scrollMargin, scrollBorder, sliderNumber, settings);

                }

            }

        },

        hideScrollbarInterval: function(newOffset, opacity, scrollbarClass, scrollbarWidth, stageWidth, scrollMargin, scrollBorder, sliderNumber, settings) {

            scrollbarDistance = (newOffset * -1) / (sliderMax[sliderNumber]) * (stageWidth - scrollMargin - scrollBorder - scrollbarWidth);

            helpers.setSliderOffset('.' + scrollbarClass, scrollbarDistance);

            $('.' + scrollbarClass).css({
                opacity: settings.scrollbarOpacity * opacity,
                filter: 'alpha(opacity:' + (settings.scrollbarOpacity * opacity * 100) + ')'
            });

        },

        slowScrollHorizontalInterval: function(node, slideNodes, newOffset, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, activeChildOffset, originalOffsets, childrenOffsets, infiniteSliderWidth, numberOfSlides, slideNodeOuterWidths, sliderNumber, centeredSlideOffset, endOffset, settings) {

            if (settings.infiniteSlider) {

                if (newOffset <= (sliderMax[sliderNumber] * -1)) {

                    var scrollerWidth = $(node).width();

                    if (newOffset <= (sliderAbsMax[sliderNumber] * -1)) {

                        var sum = originalOffsets[0] * -1;
                        $(slideNodes).each(function(i) {

                            helpers.setSliderOffset($(slideNodes)[i], sum + centeredSlideOffset);
                            if (i < childrenOffsets.length) {
                                childrenOffsets[i] = sum * -1;
                            }
                            sum = sum + slideNodeOuterWidths[i];

                        });

                        newOffset = newOffset + childrenOffsets[0] * -1;
                        sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
                        sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;
                        infiniteSliderOffset[sliderNumber] = 0;

                    } else {

                        var lowSlideNumber = 0;
                        var lowSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'x');
                        $(slideNodes).each(function(i) {

                            if (helpers.getSliderOffset(this, 'x') < lowSlideOffset) {
                                lowSlideOffset = helpers.getSliderOffset(this, 'x');
                                lowSlideNumber = i;
                            }

                        });

                        var tempOffset = sliderMin[sliderNumber] + scrollerWidth;
                        helpers.setSliderOffset($(slideNodes)[lowSlideNumber], tempOffset);

                        sliderMin[sliderNumber] = childrenOffsets[1] * -1 + centeredSlideOffset;
                        sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;

                        childrenOffsets.splice(0, 1);
                        childrenOffsets.splice(childrenOffsets.length, 0, tempOffset * -1 + centeredSlideOffset);

                        infiniteSliderOffset[sliderNumber]++;

                    }

                }

                if ((newOffset >= (sliderMin[sliderNumber] * -1)) || (newOffset >= 0)) {

                    var scrollerWidth = $(node).width();

                    if (newOffset >= 0) {

                        var sum = originalOffsets[0] * -1;
                        $(slideNodes).each(function(i) {

                            helpers.setSliderOffset($(slideNodes)[i], sum + centeredSlideOffset);
                            if (i < childrenOffsets.length) {
                                childrenOffsets[i] = sum * -1;
                            }
                            sum = sum + slideNodeOuterWidths[i];

                        });

                        newOffset = newOffset - childrenOffsets[0] * -1;
                        sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
                        sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;
                        infiniteSliderOffset[sliderNumber] = numberOfSlides;

                        while (((childrenOffsets[0] * -1 - scrollerWidth + centeredSlideOffset) > 0)) {

                            var highSlideNumber = 0;
                            var highSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'x');
                            $(slideNodes).each(function(i) {

                                if (helpers.getSliderOffset(this, 'x') > highSlideOffset) {
                                    highSlideOffset = helpers.getSliderOffset(this, 'x');
                                    highSlideNumber = i;
                                }

                            });

                            var tempOffset = sliderMin[sliderNumber] - slideNodeOuterWidths[highSlideNumber];
                            helpers.setSliderOffset($(slideNodes)[highSlideNumber], tempOffset);

                            childrenOffsets.splice(0, 0, tempOffset * -1 + centeredSlideOffset);
                            childrenOffsets.splice(childrenOffsets.length - 1, 1);

                            sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
                            sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;

                            infiniteSliderOffset[sliderNumber]--;
                            activeChildOffsets[sliderNumber]++;

                        }

                    }

                    if (newOffset < 0) {

                        var highSlideNumber = 0;
                        var highSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'x');
                        $(slideNodes).each(function(i) {

                            if (helpers.getSliderOffset(this, 'x') > highSlideOffset) {
                                highSlideOffset = helpers.getSliderOffset(this, 'x');
                                highSlideNumber = i;
                            }

                        });

                        var tempOffset = sliderMin[sliderNumber] - slideNodeOuterWidths[highSlideNumber];
                        helpers.setSliderOffset($(slideNodes)[highSlideNumber], tempOffset);

                        childrenOffsets.splice(0, 0, tempOffset * -1 + centeredSlideOffset);
                        childrenOffsets.splice(childrenOffsets.length - 1, 1);

                        sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
                        sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;

                        infiniteSliderOffset[sliderNumber]--;

                    }

                }

            }

            var slideChanged = false;
            var newChildOffset = helpers.calcActiveOffset(settings, newOffset, childrenOffsets, stageWidth, infiniteSliderOffset[sliderNumber], numberOfSlides, activeChildOffset, sliderNumber);
            var tempOffset = (newChildOffset + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;

            if (settings.infiniteSlider) {

                if (tempOffset != activeChildInfOffsets[sliderNumber]) {
                    slideChanged = true;
                }

            } else {

                if (newChildOffset != activeChildOffsets[sliderNumber]) {
                    slideChanged = true;
                }

            }

            if (slideChanged) {

                var args = new helpers.args(settings, node, $(node).children(':eq(' + tempOffset + ')'), tempOffset, endOffset, true);
                $(node).parent().data('args', args);

                if (settings.onSlideChange != '') {

                    settings.onSlideChange(args);

                }

            }

            activeChildOffsets[sliderNumber] = newChildOffset;
            activeChildInfOffsets[sliderNumber] = tempOffset;

            newOffset = Math.floor(newOffset);

            helpers.setSliderOffset(node, newOffset);

            if (settings.scrollbar) {

                scrollbarDistance = Math.floor((newOffset * -1 - sliderMin[sliderNumber] + centeredSlideOffset) / (sliderMax[sliderNumber] - sliderMin[sliderNumber] + centeredSlideOffset) * (scrollbarStageWidth - scrollMargin - scrollbarWidth));
                var width = scrollbarWidth - scrollBorder;

                if (newOffset >= (sliderMin[sliderNumber] * -1 + centeredSlideOffset)) {

                    width = scrollbarWidth - scrollBorder - (scrollbarDistance * -1);

                    helpers.setSliderOffset($('.' + scrollbarClass), 0);

                    $('.' + scrollbarClass).css({
                        width: width + 'px'
                    });

                } else if (newOffset <= ((sliderMax[sliderNumber] * -1) + 1)) {

                    width = scrollbarStageWidth - scrollMargin - scrollBorder - scrollbarDistance;

                    helpers.setSliderOffset($('.' + scrollbarClass), scrollbarDistance);

                    $('.' + scrollbarClass).css({
                        width: width + 'px'
                    });

                } else {

                    helpers.setSliderOffset($('.' + scrollbarClass), scrollbarDistance);

                    $('.' + scrollbarClass).css({
                        width: width + 'px'
                    });

                }

            }

        },

        slowScrollHorizontal: function(node, slideNodes, scrollTimeouts, scrollbarClass, xScrollDistance, yScrollDistance, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, currentEventNode, snapOverride, centeredSlideOffset, settings) {

            var distanceOffsetArray = new Array();
            var xScrollDistanceArray = new Array();
            var nodeOffset = helpers.getSliderOffset(node, 'x');
            var snapDirection = 0;
            var maxSlideVelocity = 25 / 1024 * stageWidth;
            var changeSlideFired = false;
            frictionCoefficient = settings.frictionCoefficient;
            elasticFrictionCoefficient = settings.elasticFrictionCoefficient;
            snapFrictionCoefficient = settings.snapFrictionCoefficient;

            if ((xScrollDistance > 5) && settings.snapToChildren && !snapOverride) {
                snapDirection = 1;
            } else if ((xScrollDistance < -5) && settings.snapToChildren && !snapOverride) {
                snapDirection = -1;
            }

            if (xScrollDistance < (maxSlideVelocity * -1)) {
                xScrollDistance = maxSlideVelocity * -1;
            } else if (xScrollDistance > maxSlideVelocity) {
                xScrollDistance = maxSlideVelocity;
            }

            if (!($(node)[0] === $(currentEventNode)[0])) {
                snapDirection = snapDirection * -1;
                xScrollDistance = xScrollDistance * -2;
            }

            var tempInfiniteSliderOffset = infiniteSliderOffset[sliderNumber];

            if (settings.infiniteSlider) {

                var tempSliderMin = sliderMin[sliderNumber];
                var tempSliderMax = sliderMax[sliderNumber];

            }

            var tempChildrenOffsets = new Array();
            var tempSlideNodeOffsets = new Array();

            for (var i = 0; i < childrenOffsets.length; i++) {

                tempChildrenOffsets[i] = childrenOffsets[i];

                if (i < slideNodes.length) {
                    tempSlideNodeOffsets[i] = helpers.getSliderOffset($(slideNodes[i]), 'x');
                }

            }

            while ((xScrollDistance > 1) || (xScrollDistance < -1)) {

                xScrollDistance = xScrollDistance * frictionCoefficient;
                nodeOffset = nodeOffset + xScrollDistance;

                if (((nodeOffset > (sliderMin[sliderNumber] * -1)) || (nodeOffset < (sliderMax[sliderNumber] * -1))) && !settings.infiniteSlider) {
                    xScrollDistance = xScrollDistance * elasticFrictionCoefficient;
                    nodeOffset = nodeOffset + xScrollDistance;
                }

                if (settings.infiniteSlider) {

                    if (nodeOffset <= (tempSliderMax * -1)) {

                        var scrollerWidth = $(node).width();

                        var lowSlideNumber = 0;
                        var lowSlideOffset = tempSlideNodeOffsets[0];
                        for (var i = 0; i < tempSlideNodeOffsets.length; i++) {

                            if (tempSlideNodeOffsets[i] < lowSlideOffset) {
                                lowSlideOffset = tempSlideNodeOffsets[i];
                                lowSlideNumber = i;
                            }

                        }

                        var newOffset = tempSliderMin + scrollerWidth;
                        tempSlideNodeOffsets[lowSlideNumber] = newOffset;

                        tempSliderMin = tempChildrenOffsets[1] * -1 + centeredSlideOffset;
                        tempSliderMax = tempSliderMin + scrollerWidth - stageWidth;

                        tempChildrenOffsets.splice(0, 1);
                        tempChildrenOffsets.splice(tempChildrenOffsets.length, 0, newOffset * -1 + centeredSlideOffset);

                        tempInfiniteSliderOffset++;

                    }

                    if (nodeOffset >= (tempSliderMin * -1)) {

                        var scrollerWidth = $(node).width();

                        var highSlideNumber = 0;
                        var highSlideOffset = tempSlideNodeOffsets[0];
                        for (var i = 0; i < tempSlideNodeOffsets.length; i++) {

                            if (tempSlideNodeOffsets[i] > highSlideOffset) {
                                highSlideOffset = tempSlideNodeOffsets[i];
                                highSlideNumber = i;
                            }

                        }

                        var newOffset = tempSliderMin - slideNodeOuterWidths[highSlideNumber];
                        tempSlideNodeOffsets[highSlideNumber] = newOffset;

                        tempChildrenOffsets.splice(0, 0, newOffset * -1 + centeredSlideOffset);
                        tempChildrenOffsets.splice(tempChildrenOffsets.length - 1, 1);

                        tempSliderMin = tempChildrenOffsets[0] * -1 + centeredSlideOffset;
                        tempSliderMax = tempSliderMin + scrollerWidth - stageWidth;

                        tempInfiniteSliderOffset--;

                    }

                }

                distanceOffsetArray[distanceOffsetArray.length] = nodeOffset;
                xScrollDistanceArray[xScrollDistanceArray.length] = xScrollDistance;

            }

            var slideChanged = false;
            var newChildOffset = helpers.calcActiveOffset(settings, nodeOffset, tempChildrenOffsets, stageWidth, tempInfiniteSliderOffset, numberOfSlides, activeChildOffsets[sliderNumber], sliderNumber);
            var tempOffset = (newChildOffset + tempInfiniteSliderOffset + numberOfSlides) % numberOfSlides;

            if (settings.snapToChildren) {

                if (settings.infiniteSlider) {

                    if (tempOffset != activeChildInfOffsets[sliderNumber]) {
                        slideChanged = true;
                    }

                } else {

                    if (newChildOffset != activeChildOffsets[sliderNumber]) {
                        slideChanged = true;
                    }

                }

                if ((snapDirection < 0) && !slideChanged) {

                    newChildOffset++;

                    if ((newChildOffset >= childrenOffsets.length) && !settings.infinteSlider) newChildOffset = childrenOffsets.length - 1;

                } else if ((snapDirection > 0) && !slideChanged) {

                    newChildOffset--;

                    if ((newChildOffset < 0) && !settings.infinteSlider) newChildOffset = 0;

                }

            }

            if (settings.snapToChildren || (((nodeOffset > (sliderMin[sliderNumber] * -1)) || (nodeOffset < (sliderMax[sliderNumber] * -1))) && !settings.infiniteSlider)) {

                nodeOffset = helpers.getSliderOffset(node, 'x');
                distanceOffsetArray.splice(0, distanceOffsetArray.length);

                while ((nodeOffset < (tempChildrenOffsets[newChildOffset] - 0.5)) || (nodeOffset > (tempChildrenOffsets[newChildOffset] + 0.5))) {

                    nodeOffset = ((nodeOffset - (tempChildrenOffsets[newChildOffset])) * snapFrictionCoefficient) + (tempChildrenOffsets[newChildOffset]);
                    distanceOffsetArray[distanceOffsetArray.length] = nodeOffset;

                }

                distanceOffsetArray[distanceOffsetArray.length] = tempChildrenOffsets[newChildOffset];

            }

            var jStart = 1;
            if ((distanceOffsetArray.length % 2) != 0) {
                jStart = 0;
            }

            var lastTimeoutRegistered = 0;
            var count = 0;

            for (var j = 0; j < scrollTimeouts.length; j++) {
                clearTimeout(scrollTimeouts[j]);
            }

            var endOffset = (newChildOffset + tempInfiniteSliderOffset + numberOfSlides) % numberOfSlides;

            var lastCheckOffset = 0;
            for (var j = jStart; j < distanceOffsetArray.length; j = j + 2) {

                if ((j == jStart) || (Math.abs(distanceOffsetArray[j] - lastCheckOffset) > 1) || (j >= (distanceOffsetArray.length - 2))) {

                    lastCheckOffset = distanceOffsetArray[j];

                    scrollTimeouts[scrollTimeouts.length] = helpers.slowScrollHorizontalIntervalTimer(scrollIntervalTime * j, node, slideNodes, distanceOffsetArray[j], scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, newChildOffset, originalOffsets, childrenOffsets, infiniteSliderWidth, numberOfSlides, slideNodeOuterWidths, sliderNumber, centeredSlideOffset, endOffset, settings);

                }

            }

            var slideChanged = false;
            var tempOffset = (newChildOffset + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;

            if (settings.infiniteSlider) {

                if (tempOffset != activeChildInfOffsets[sliderNumber]) {
                    slideChanged = true;
                }

            } else {

                if (newChildOffset != activeChildOffsets[sliderNumber]) {
                    slideChanged = true;
                }

            }

            if (settings.onSlideComplete != '') {

                scrollTimeouts[scrollTimeouts.length] = helpers.onSlideCompleteTimer(scrollIntervalTime * (j + 1), settings, node, $(node).children(':eq(' + tempOffset + ')'), tempOffset, sliderNumber);

            }

            slideTimeouts[sliderNumber] = scrollTimeouts;

            helpers.hideScrollbar(settings, scrollTimeouts, j, distanceOffsetArray, scrollbarClass, scrollbarWidth, stageWidth, scrollMargin, scrollBorder, sliderNumber);

        },

        onSlideComplete: function(settings, node, slideNode, newChildOffset, sliderNumber) {

            var isChanged = (onChangeEventLastFired[sliderNumber] != newChildOffset) ? true : false;
            var args = new helpers.args(settings, $(node), slideNode, newChildOffset, newChildOffset, isChanged);
            $(node).parent().data('args', args);

            if (settings.onSlideComplete != '') {

                settings.onSlideComplete(args);

            }

            onChangeEventLastFired[sliderNumber] = newChildOffset;

        },

        getSliderOffset: function(node, xy) {

            var sliderOffset = 0;
            if (xy == 'x') {
                xy = 4;
            } else {
                xy = 5;
            }

            if (has3DTransform && !isIe7 && !isIe8) {

                var transforms = new Array('-webkit-transform', '-moz-transform', 'transform');

                for (var i = 0; i < transforms.length; i++) {

                    if ($(node).css(transforms[i]) != undefined) {

                        if ($(node).css(transforms[i]).length > 0) {

                            var transformArray = $(node).css(transforms[i]).split(',');

                            break;

                        }

                    }

                }

                sliderOffset = parseInt(transformArray[xy], 10);

            } else {

                sliderOffset = parseInt($(node).css('left'), 10);

            }

            return sliderOffset;

        },

        setSliderOffset: function(node, sliderOffset) {

            if (has3DTransform && !isIe7 && !isIe8) {

                $(node).css({
                    'webkitTransform': 'matrix(1,0,0,1,' + sliderOffset + ',0)',
                    'MozTransform': 'matrix(1,0,0,1,' + sliderOffset + ',0)',
                    'transform': 'matrix(1,0,0,1,' + sliderOffset + ',0)'
                });

            } else {

                $(node).css({
                    left: sliderOffset + 'px'
                });

            }

        },

        setBrowserInfo: function() {

            if (navigator.userAgent.match('WebKit') != null) {
                isWebkit = true;
                grabOutCursor = '-webkit-grab';
                grabInCursor = '-webkit-grabbing';
            } else if (navigator.userAgent.match('Gecko') != null) {
                isGecko = true;
                grabOutCursor = 'move';
                grabInCursor = '-moz-grabbing';
            } else if (navigator.userAgent.match('MSIE 7') != null) {
                isIe7 = true;
                isIe = true;
            } else if (navigator.userAgent.match('MSIE 8') != null) {
                isIe8 = true;
                isIe = true;
            } else if (navigator.userAgent.match('MSIE 9') != null) {
                isIe9 = true;
                isIe = true;
            }

        },

        has3DTransform: function() {

            var has3D = false;

            var testElement = $('<div />').css({
                'webkitTransform': 'matrix(1,1,1,1,1,1)',
                'MozTransform': 'matrix(1,1,1,1,1,1)',
                'transform': 'matrix(1,1,1,1,1,1)'
            });

            if (testElement.attr('style') == '') {
                has3D = false;
            } else if (testElement.attr('style') != undefined) {
                has3D = true;
            }

            return has3D;

        },

        getSlideNumber: function(slide, sliderNumber, numberOfSlides) {

            return (slide - infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;

        },

        calcActiveOffset: function(settings, offset, childrenOffsets, stageWidth, infiniteSliderOffset, numberOfSlides, activeChildOffset, sliderNumber) {

            var isFirst = false;
            var arrayOfOffsets = new Array();
            var newChildOffset;

            for (var i = 0; i < childrenOffsets.length; i++) {

                if ((childrenOffsets[i] <= offset) && (childrenOffsets[i] > (offset - stageWidth))) {

                    if (!isFirst && (childrenOffsets[i] != offset)) {

                        arrayOfOffsets[arrayOfOffsets.length] = childrenOffsets[i - 1];

                    }

                    arrayOfOffsets[arrayOfOffsets.length] = childrenOffsets[i];

                    isFirst = true;

                }

            }

            if (arrayOfOffsets.length == 0) {
                arrayOfOffsets[0] = childrenOffsets[childrenOffsets.length - 1];
            }

            var distance = stageWidth;
            var closestChildOffset = 0;

            for (var i = 0; i < arrayOfOffsets.length; i++) {

                var newDistance = Math.abs(offset - arrayOfOffsets[i]);

                if (newDistance < distance) {
                    closestChildOffset = arrayOfOffsets[i];
                    distance = newDistance;
                }

            }

            for (var i = 0; i < childrenOffsets.length; i++) {

                if (closestChildOffset == childrenOffsets[i]) {

                    newChildOffset = i;

                }

            }

            return newChildOffset;

        },

        changeSlide: function(slide, node, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings) {

            helpers.autoSlidePause(sliderNumber);

            for (var j = 0; j < scrollTimeouts.length; j++) {
                clearTimeout(scrollTimeouts[j]);
            }

            var steps = Math.ceil(settings.autoSlideTransTimer / 10) + 1;
            var startOffset = helpers.getSliderOffset(node, 'x');
            var endOffset = childrenOffsets[slide];
            var offsetDiff = endOffset - startOffset;

            if (settings.infiniteSlider) {

                slide = (slide - infiniteSliderOffset[sliderNumber] + numberOfSlides * 2) % numberOfSlides;

                var appendArray = false;
                if ((slide == 0) && (numberOfSlides == 2)) {

                    slide = numberOfSlides;
                    childrenOffsets[slide] = childrenOffsets[slide - 1] - $(slideNodes).eq(0).outerWidth(true);
                    appendArray = true;

                }

                endOffset = childrenOffsets[slide];
                offsetDiff = endOffset - startOffset;

                var offsets = new Array(childrenOffsets[slide] - $(node).width(), childrenOffsets[slide] + $(node).width());

                if (appendArray) {
                    childrenOffsets.splice(childrenOffsets.length - 1, 1);
                }

                for (var i = 0; i < offsets.length; i++) {

                    if (Math.abs(offsets[i] - startOffset) < Math.abs(offsetDiff)) {
                        offsetDiff = (offsets[i] - startOffset);
                    }

                }

            }

            var stepArray = new Array();
            var t;
            var nextStep;

            helpers.showScrollbar(settings, scrollbarClass);

            for (var i = 0; i <= steps; i++) {

                t = i;
                t /= steps;
                t--;
                nextStep = startOffset + offsetDiff * (Math.pow(t, 5) + 1);

                stepArray[stepArray.length] = nextStep;

            }

            var lastCheckOffset = 0;
            for (var i = 0; i < stepArray.length; i++) {

                if ((i == 0) || (Math.abs(stepArray[i] - lastCheckOffset) > 1) || (i >= (stepArray.length - 2))) {

                    lastCheckOffset = stepArray[i];

                    scrollTimeouts[i] = helpers.slowScrollHorizontalIntervalTimer(scrollIntervalTime * (i + 1), node, slideNodes, stepArray[i], scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, slide, originalOffsets, childrenOffsets, infiniteSliderWidth, numberOfSlides, slideNodeOuterWidths, sliderNumber, centeredSlideOffset, slide, settings);

                }

                if ((i == 0) && (settings.onSlideStart != '')) {
                    var tempOffset = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;

                    settings.onSlideStart(new helpers.args(settings, node, $(node).children(':eq(' + tempOffset + ')'), tempOffset, slide, false));
                }

            }

            var slideChanged = false;
            var tempOffset = (slide + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;

            if (settings.infiniteSlider) {

                if (tempOffset != activeChildInfOffsets[sliderNumber]) {
                    slideChanged = true;
                }

            } else {

                if (slide != activeChildOffsets[sliderNumber]) {
                    slideChanged = true;
                }

            }

            if (slideChanged && (settings.onSlideComplete != '')) {

                scrollTimeouts[scrollTimeouts.length] = helpers.onSlideCompleteTimer(scrollIntervalTime * (i + 1), settings, node, $(node).children(':eq(' + tempOffset + ')'), tempOffset, sliderNumber);
            }

            slideTimeouts[sliderNumber] = scrollTimeouts;

            helpers.hideScrollbar(settings, scrollTimeouts, i, stepArray, scrollbarClass, scrollbarWidth, stageWidth, scrollMargin, scrollBorder, sliderNumber);

            helpers.autoSlide(node, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);

        },

        autoSlide: function(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings) {

            if (!settings.autoSlide) return false;

            helpers.autoSlidePause(sliderNumber);

            autoSlideTimeouts[sliderNumber] = setTimeout(function() {

                if (!settings.infiniteSlider && (activeChildOffsets[sliderNumber] > childrenOffsets.length - 1)) {
                    activeChildOffsets[sliderNumber] = activeChildOffsets[sliderNumber] - numberOfSlides;
                }

                var nextSlide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides + 1) % numberOfSlides;

                helpers.changeSlide(nextSlide, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);

                helpers.autoSlide(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);

            }, settings.autoSlideTimer + settings.autoSlideTransTimer);

        },

        autoSlidePause: function(sliderNumber) {

            clearTimeout(autoSlideTimeouts[sliderNumber]);

        },

        isUnselectable: function(node, settings) {

            if (settings.unselectableSelector != '') {
                if ($(node).closest(settings.unselectableSelector).size() == 1) return true;
            }

            return false;

        },

        /* timers */
        slowScrollHorizontalIntervalTimer: function(scrollIntervalTime, node, slideNodes, step, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, slide, originalOffsets, childrenOffsets, infiniteSliderWidth, numberOfSlides, slideNodeOuterWidths, sliderNumber, centeredSlideOffset, endOffset, settings) {

            var scrollTimeout = setTimeout(function() {
                helpers.slowScrollHorizontalInterval(node, slideNodes, step, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, slide, originalOffsets, childrenOffsets, infiniteSliderWidth, numberOfSlides, slideNodeOuterWidths, sliderNumber, centeredSlideOffset, endOffset, settings);
            }, scrollIntervalTime);

            return scrollTimeout;

        },

        onSlideCompleteTimer: function(scrollIntervalTime, settings, node, slideNode, slide, scrollbarNumber) {

            var scrollTimeout = setTimeout(function() {
                helpers.onSlideComplete(settings, node, slideNode, slide, scrollbarNumber);
            }, scrollIntervalTime);

            return scrollTimeout;

        },

        hideScrollbarIntervalTimer: function(scrollIntervalTime, newOffset, opacity, scrollbarClass, scrollbarWidth, stageWidth, scrollMargin, scrollBorder, sliderNumber, settings) {

            var scrollTimeout = setTimeout(function() {
                helpers.hideScrollbarInterval(newOffset, opacity, scrollbarClass, scrollbarWidth, stageWidth, scrollMargin, scrollBorder, sliderNumber, settings);
            }, scrollIntervalTime);

            return scrollTimeout;

        },

        args: function(settings, node, activeSlideNode, newChildOffset, targetSlideOffset, isChanged) {

            this.settings = settings;
            this.data = $(node).parent().data('iosslider');
            this.slideChanged = isChanged;
            this.sliderObject = node;
            this.sliderContainerObject = $(node).parent();
            this.currentSlideObject = activeSlideNode;
            this.currentSlideNumber = newChildOffset + 1;
            this.targetSlideObject = $(node).children(':eq(' + targetSlideOffset + ')');
            this.targetSlideNumber = targetSlideOffset + 1;
            this.currentSliderOffset = helpers.getSliderOffset(node, 'x') * -1;

            try {
                if ($(node).parent().data('args') == undefined) {
                    this.prevSlideNumber = settings.startAtSlide;
                } else if ($(node).parent().data('args').prevSlideNumber == this.currentSlideNumber) {
                    this.prevSlideNumber = $(node).parent().data('args').currentSlideNumber;
                } else {
                    this.prevSlideNumber = $(node).parent().data('args').prevSlideNumber;
                }

                this.prevSlideObject = $(node).children(':eq(' + this.prevSlideNumber + ')');
            } catch (e) {}

        },

        preventDrag: function(event) {
            event.preventDefault();
        },

        preventClick: function(event) {
            event.stopImmediatePropagation();
            return false;
        },

        enableClick: function() {
            return true;
        }

    }

    helpers.setBrowserInfo();

    var methods = {

        init: function(options, node) {

            has3DTransform = helpers.has3DTransform();

            var settings = $.extend(true, {
                'elasticPullResistance': 0.6,
                'frictionCoefficient': 0.92,
                'elasticFrictionCoefficient': 0.6,
                'snapFrictionCoefficient': 0.92,
                'snapToChildren': false,
                'snapSlideCenter': false,
                'startAtSlide': 1,
                'scrollbar': false,
                'scrollbarDrag': false,
                'scrollbarHide': true,
                'scrollbarLocation': 'top',
                'scrollbarContainer': '',
                'scrollbarOpacity': 0.4,
                'scrollbarHeight': '4px',
                'scrollbarBorder': '0',
                'scrollbarMargin': '5px',
                'scrollbarBackground': '#000',
                'scrollbarBorderRadius': '100px',
                'scrollbarShadow': '0 0 0 #000',
                'scrollbarElasticPullResistance': 0.9,
                'desktopClickDrag': false,
                'keyboardControls': false,
                'tabToAdvance': false,
                'responsiveSlideContainer': true,
                'responsiveSlides': true,
                'navSlideSelector': '',
                'navPrevSelector': '',
                'navNextSelector': '',
                'autoSlideToggleSelector': '',
                'autoSlide': false,
                'autoSlideTimer': 5000,
                'autoSlideTransTimer': 750,
                'infiniteSlider': false,
                'stageCSS': {
                    position: 'relative',
                    top: '0',
                    left: '0',
                    overflow: 'hidden',
                    zIndex: 1
                },
                'unselectableSelector': '',
                'onSliderLoaded': '',
                'onSliderUpdate': '',
                'onSliderResize': '',
                'onSlideStart': '',
                'onSlideChange': '',
                'onSlideComplete': ''
            }, options);

            if (node == undefined) {
                node = this;
            }

            return $(node).each(function(i) {

                scrollbarNumber++;
                var sliderNumber = scrollbarNumber;
                var scrollTimeouts = new Array();
                iosSliderSettings[sliderNumber] = settings;
                sliderMin[sliderNumber] = 0;
                sliderMax[sliderNumber] = 0;
                var minTouchpoints = 0;
                var xCurrentScrollRate = new Array(0, 0);
                var yCurrentScrollRate = new Array(0, 0);
                var scrollbarBlockClass = 'scrollbarBlock' + scrollbarNumber;
                var scrollbarClass = 'scrollbar' + scrollbarNumber;
                var scrollbarNode;
                var scrollbarBlockNode;
                var scrollbarStageWidth;
                var scrollbarWidth;
                var containerWidth;
                var containerHeight;
                var centeredSlideOffset = 0;
                var stageNode = $(this);
                var stageWidth;
                var stageHeight;
                var slideWidth;
                var scrollMargin;
                var scrollBorder;
                var lastTouch;
                var isFirstInit = true;
                var newChildOffset = -1;
                var webkitTransformArray = new Array();
                var childrenOffsets;
                var originalOffsets = new Array();
                var scrollbarStartOpacity = 0;
                var xScrollStartPosition = 0;
                var yScrollStartPosition = 0;
                var currentTouches = 0;
                var scrollerNode = $(this).children(':first-child');
                var slideNodes;
                var slideNodeWidths;
                var slideNodeOuterWidths;
                var numberOfSlides = $(scrollerNode).children().not('script').size();
                var xScrollStarted = false;
                var lastChildOffset = 0;
                var isMouseDown = false;
                var currentSlider = undefined;
                var sliderStopLocation = 0;
                var infiniteSliderWidth;
                infiniteSliderOffset[sliderNumber] = 0;
                var shortContent = false;
                onChangeEventLastFired[sliderNumber] = -1;
                var isAutoSlideToggleOn = false;
                iosSliders[sliderNumber] = stageNode;
                isEventCleared[sliderNumber] = false;
                var currentEventNode;
                var intermediateChildOffset = 0;
                var tempInfiniteSliderOffset = 0;
                var preventXScroll = false;
                var snapOverride = false;
                var clickEvent = 'touchstart.iosSliderEvent click.iosSliderEvent';
                var scrollerWidth;
                var anchorEvents;
                var onclickEvents;
                var allScrollerNodeChildren;
                touchLocks[sliderNumber] = false;
                slideTimeouts[sliderNumber] = new Array();
                if (settings.scrollbarDrag) {
                    settings.scrollbar = true;
                    settings.scrollbarHide = false;
                }
                var $this = $(this);
                var data = $this.data('iosslider');
                if (data != undefined) return true;

                $(this).find('img').bind('dragstart.iosSliderEvent', function(event) {
                    event.preventDefault();
                });

                if (settings.infiniteSlider) {
                    settings.scrollbar = false;
                }

                if (settings.scrollbar) {

                    if (settings.scrollbarContainer != '') {
                        $(settings.scrollbarContainer).append("<div class = '" + scrollbarBlockClass + "'><div class = '" + scrollbarClass + "'></div></div>");
                    } else {
                        $(scrollerNode).parent().append("<div class = '" + scrollbarBlockClass + "'><div class = '" + scrollbarClass + "'></div></div>");
                    }

                }

                if (!init()) return true;

                $(this).find('a').bind('mousedown', helpers.preventDrag);
                $(this).find("[onclick]").bind('click', helpers.preventDrag).each(function() {

                    $(this).data('onclick', this.onclick);

                });

                var newChildOffset = helpers.calcActiveOffset(settings, helpers.getSliderOffset($(scrollerNode), 'x'), childrenOffsets, stageWidth, infiniteSliderOffset[sliderNumber], numberOfSlides, undefined, sliderNumber);
                var tempOffset = (newChildOffset + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;

                var args = new helpers.args(settings, scrollerNode, $(scrollerNode).children(':eq(' + tempOffset + ')'), tempOffset, tempOffset, false);
                $(stageNode).data('args', args);

                if (settings.onSliderLoaded != '') {

                    settings.onSliderLoaded(args);

                }

                onChangeEventLastFired[sliderNumber] = tempOffset;

                function init() {

                    helpers.autoSlidePause(sliderNumber);

                    anchorEvents = $(scrollerNode).find('a');
                    onclickEvents = $(scrollerNode).find('[onclick]');
                    allScrollerNodeChildren = $(scrollerNode).find('*');

                    $(stageNode).css('width', '');
                    $(stageNode).css('height', '');
                    $(scrollerNode).css('width', '');
                    slideNodes = $(scrollerNode).children().not('script').get();
                    slideNodeWidths = new Array();
                    slideNodeOuterWidths = new Array();

                    $(slideNodes).css('width', '');

                    sliderMax[sliderNumber] = 0;
                    childrenOffsets = new Array();
                    containerWidth = $(stageNode).parent().width();
                    stageWidth = $(stageNode).outerWidth(true);

                    if (settings.responsiveSlideContainer) {
                        stageWidth = ($(stageNode).outerWidth(true) > containerWidth) ? containerWidth : $(stageNode).outerWidth(true);
                    }

                    $(stageNode).css({
                        position: settings.stageCSS.position,
                        top: settings.stageCSS.top,
                        left: settings.stageCSS.left,
                        overflow: settings.stageCSS.overflow,
                        zIndex: settings.stageCSS.zIndex,
                        'webkitPerspective': 1000,
                        'webkitBackfaceVisibility': 'hidden',
                        width: stageWidth
                    });

                    $(settings.unselectableSelector).css({
                        cursor: 'default'
                    });

                    for (var j = 0; j < slideNodes.length; j++) {

                        slideNodeWidths[j] = $(slideNodes[j]).width();
                        slideNodeOuterWidths[j] = $(slideNodes[j]).outerWidth(true);
                        var newWidth = slideNodeOuterWidths[j];

                        if (settings.responsiveSlides) {

                            if (slideNodeOuterWidths[j] > stageWidth) {

                                newWidth = stageWidth + (slideNodeOuterWidths[j] - slideNodeWidths[j]) * -1;

                            } else {

                                newWidth = slideNodeWidths[j];

                            }

                            $(slideNodes[j]).css({
                                width: newWidth
                            });

                        }

                        $(slideNodes[j]).css({
                            'webkitBackfaceVisibility': 'hidden',
                            position: 'absolute',
                            top: 0
                        });

                        childrenOffsets[j] = sliderMax[sliderNumber] * -1;

                        sliderMax[sliderNumber] = sliderMax[sliderNumber] + newWidth + (slideNodeOuterWidths[j] - slideNodeWidths[j]);

                    }

                    if (settings.snapSlideCenter) {
                        centeredSlideOffset = (stageWidth - slideNodeOuterWidths[0]) * 0.5;

                        if (settings.responsiveSlides && (slideNodeOuterWidths[0] > stageWidth)) {
                            centeredSlideOffset = 0;
                        }
                    }

                    sliderAbsMax[sliderNumber] = sliderMax[sliderNumber] * 2;

                    for (var j = 0; j < slideNodes.length; j++) {

                        helpers.setSliderOffset($(slideNodes[j]), childrenOffsets[j] * -1 + sliderMax[sliderNumber] + centeredSlideOffset);

                        childrenOffsets[j] = childrenOffsets[j] - sliderMax[sliderNumber];

                    }

                    if (!settings.infiniteSlider && !settings.snapSlideCenter) {

                        for (var i = 0; i < childrenOffsets.length; i++) {

                            if (childrenOffsets[i] <= ((sliderMax[sliderNumber] * 2 - stageWidth) * -1)) {
                                break;
                            }

                            lastChildOffset = i;

                        }

                        childrenOffsets.splice(lastChildOffset + 1, childrenOffsets.length);
                        childrenOffsets[childrenOffsets.length] = (sliderMax[sliderNumber] * 2 - stageWidth) * -1;

                    }

                    for (var i = 0; i < childrenOffsets.length; i++) {
                        originalOffsets[i] = childrenOffsets[i];
                    }

                    if (isFirstInit) {
                        settings.startAtSlide = (iosSliderSettings[sliderNumber].startAtSlide > childrenOffsets.length) ? childrenOffsets.length : iosSliderSettings[sliderNumber].startAtSlide;
                        if (settings.infiniteSlider) {
                            settings.startAtSlide = (iosSliderSettings[sliderNumber].startAtSlide - 1 + numberOfSlides) % numberOfSlides;
                            activeChildOffsets[sliderNumber] = (iosSliderSettings[sliderNumber].startAtSlide);
                        } else {
                            settings.startAtSlide = ((iosSliderSettings[sliderNumber].startAtSlide - 1) < 0) ? childrenOffsets.length - 1 : iosSliderSettings[sliderNumber].startAtSlide;
                            activeChildOffsets[sliderNumber] = (iosSliderSettings[sliderNumber].startAtSlide - 1);
                        }
                        activeChildInfOffsets[sliderNumber] = activeChildOffsets[sliderNumber];
                    }

                    sliderMin[sliderNumber] = sliderMax[sliderNumber] + centeredSlideOffset;

                    $(scrollerNode).css({
                        position: 'relative',
                        cursor: grabOutCursor,
                        'webkitPerspective': '0',
                        'webkitBackfaceVisibility': 'hidden',
                        width: sliderMax[sliderNumber] + 'px'
                    });

                    scrollerWidth = sliderMax[sliderNumber];
                    sliderMax[sliderNumber] = sliderMax[sliderNumber] * 2 - stageWidth + centeredSlideOffset * 2;

                    shortContent = (scrollerWidth < stageWidth) ? true : false;

                    if (shortContent) {

                        $(scrollerNode).css({
                            cursor: 'default'
                        });

                    }

                    containerHeight = $(stageNode).parent().outerHeight(true);
                    stageHeight = $(stageNode).height();

                    if (settings.responsiveSlideContainer) {
                        stageHeight = (stageHeight > containerHeight) ? containerHeight : stageHeight;
                    }

                    $(stageNode).css({
                        height: stageHeight
                    });

                    helpers.setSliderOffset(scrollerNode, childrenOffsets[activeChildOffsets[sliderNumber]]);

                    if (settings.infiniteSlider && !shortContent) {

                        var currentScrollOffset = helpers.getSliderOffset($(scrollerNode), 'x');
                        var count = (infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides * -1;

                        while (count < 0) {

                            var lowSlideNumber = 0;
                            var lowSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'x');
                            $(slideNodes).each(function(i) {

                                if (helpers.getSliderOffset(this, 'x') < lowSlideOffset) {
                                    lowSlideOffset = helpers.getSliderOffset(this, 'x');
                                    lowSlideNumber = i;
                                }

                            });

                            var newOffset = sliderMin[sliderNumber] + scrollerWidth;
                            helpers.setSliderOffset($(slideNodes)[lowSlideNumber], newOffset);

                            sliderMin[sliderNumber] = childrenOffsets[1] * -1 + centeredSlideOffset;
                            sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;

                            childrenOffsets.splice(0, 1);
                            childrenOffsets.splice(childrenOffsets.length, 0, newOffset * -1 + centeredSlideOffset);

                            count++;

                        }

                        while (((childrenOffsets[0] * -1 - scrollerWidth + centeredSlideOffset) > 0) && settings.snapSlideCenter && isFirstInit) {

                            var highSlideNumber = 0;
                            var highSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'x');
                            $(slideNodes).each(function(i) {

                                if (helpers.getSliderOffset(this, 'x') > highSlideOffset) {
                                    highSlideOffset = helpers.getSliderOffset(this, 'x');
                                    highSlideNumber = i;
                                }

                            });

                            var newOffset = sliderMin[sliderNumber] - slideNodeOuterWidths[highSlideNumber];
                            helpers.setSliderOffset($(slideNodes)[highSlideNumber], newOffset);

                            childrenOffsets.splice(0, 0, newOffset * -1 + centeredSlideOffset);
                            childrenOffsets.splice(childrenOffsets.length - 1, 1);

                            sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
                            sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;

                            infiniteSliderOffset[sliderNumber]--;
                            activeChildOffsets[sliderNumber]++;

                        }

                        while (currentScrollOffset <= (sliderMax[sliderNumber] * -1)) {

                            var lowSlideNumber = 0;
                            var lowSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'x');
                            $(slideNodes).each(function(i) {

                                if (helpers.getSliderOffset(this, 'x') < lowSlideOffset) {
                                    lowSlideOffset = helpers.getSliderOffset(this, 'x');
                                    lowSlideNumber = i;
                                }

                            });

                            var newOffset = sliderMin[sliderNumber] + scrollerWidth;
                            helpers.setSliderOffset($(slideNodes)[lowSlideNumber], newOffset);

                            sliderMin[sliderNumber] = childrenOffsets[1] * -1 + centeredSlideOffset;
                            sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;

                            childrenOffsets.splice(0, 1);
                            childrenOffsets.splice(childrenOffsets.length, 0, newOffset * -1 + centeredSlideOffset);

                            infiniteSliderOffset[sliderNumber]++;
                            activeChildOffsets[sliderNumber]--;

                        }

                    }

                    helpers.setSliderOffset(scrollerNode, childrenOffsets[activeChildOffsets[sliderNumber]]);

                    if (!settings.desktopClickDrag) {

                        $(scrollerNode).css({
                            cursor: 'default'
                        });

                    }

                    if (settings.scrollbar) {

                        $('.' + scrollbarBlockClass).css({
                            margin: settings.scrollbarMargin,
                            overflow: 'hidden',
                            display: 'none'
                        });

                        $('.' + scrollbarBlockClass + ' .' + scrollbarClass).css({
                            border: settings.scrollbarBorder
                        });

                        scrollMargin = parseInt($('.' + scrollbarBlockClass).css('marginLeft')) + parseInt($('.' + scrollbarBlockClass).css('marginRight'));
                        scrollBorder = parseInt($('.' + scrollbarBlockClass + ' .' + scrollbarClass).css('borderLeftWidth'), 10) + parseInt($('.' + scrollbarBlockClass + ' .' + scrollbarClass).css('borderRightWidth'), 10);
                        scrollbarStageWidth = (settings.scrollbarContainer != '') ? $(settings.scrollbarContainer).width() : stageWidth;
                        scrollbarWidth = (scrollbarStageWidth - scrollMargin) / numberOfSlides;

                        if (!settings.scrollbarHide) {
                            scrollbarStartOpacity = settings.scrollbarOpacity;
                        }

                        $('.' + scrollbarBlockClass).css({
                            position: 'absolute',
                            left: 0,
                            width: scrollbarStageWidth - scrollMargin + 'px',
                            margin: settings.scrollbarMargin
                        });

                        if (settings.scrollbarLocation == 'top') {
                            $('.' + scrollbarBlockClass).css('top', '0');
                        } else {
                            $('.' + scrollbarBlockClass).css('bottom', '0');
                        }

                        $('.' + scrollbarBlockClass + ' .' + scrollbarClass).css({
                            borderRadius: settings.scrollbarBorderRadius,
                            background: settings.scrollbarBackground,
                            height: settings.scrollbarHeight,
                            width: scrollbarWidth - scrollBorder + 'px',
                            minWidth: settings.scrollbarHeight,
                            border: settings.scrollbarBorder,
                            'webkitPerspective': 1000,
                            'webkitBackfaceVisibility': 'hidden',
                            'position': 'relative',
                            opacity: scrollbarStartOpacity,
                            filter: 'alpha(opacity:' + (scrollbarStartOpacity * 100) + ')',
                            boxShadow: settings.scrollbarShadow
                        });

                        helpers.setSliderOffset($('.' + scrollbarBlockClass + ' .' + scrollbarClass), Math.floor((childrenOffsets[activeChildOffsets[sliderNumber]] * -1 - sliderMin[sliderNumber] + centeredSlideOffset) / (sliderMax[sliderNumber] - sliderMin[sliderNumber] + centeredSlideOffset) * (scrollbarStageWidth - scrollMargin - scrollbarWidth)));

                        $('.' + scrollbarBlockClass).css({
                            display: 'block'
                        });

                        scrollbarNode = $('.' + scrollbarBlockClass + ' .' + scrollbarClass);
                        scrollbarBlockNode = $('.' + scrollbarBlockClass);

                    }

                    if (settings.scrollbarDrag && !shortContent) {
                        $('.' + scrollbarBlockClass + ' .' + scrollbarClass).css({
                            cursor: grabOutCursor
                        });
                    }

                    if (settings.infiniteSlider) {

                        infiniteSliderWidth = (sliderMax[sliderNumber] + stageWidth) / 3;

                    }

                    if (settings.navSlideSelector != '') {

                        $(settings.navSlideSelector).each(function(j) {

                            $(this).css({
                                cursor: 'pointer'
                            });

                            $(this).unbind(clickEvent).bind(clickEvent, function(e) {

                                if (e.type == 'touchstart') {
                                    $(this).unbind('click.iosSliderEvent');
                                } else {
                                    $(this).unbind('touchstart.iosSliderEvent');
                                }
                                clickEvent = e.type + '.iosSliderEvent';

                                helpers.changeSlide(j, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);

                            });

                        });

                    }

                    if (settings.navPrevSelector != '') {

                        $(settings.navPrevSelector).css({
                            cursor: 'pointer'
                        });

                        $(settings.navPrevSelector).unbind(clickEvent).bind(clickEvent, function(e) {

                            if (e.type == 'touchstart') {
                                $(this).unbind('click.iosSliderEvent');
                            } else {
                                $(this).unbind('touchstart.iosSliderEvent');
                            }
                            clickEvent = e.type + '.iosSliderEvent';

                            var slide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;

                            if ((slide > 0) || settings.infiniteSlider) {
                                helpers.changeSlide(slide - 1, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
                            }
                        });

                    }

                    if (settings.navNextSelector != '') {

                        $(settings.navNextSelector).css({
                            cursor: 'pointer'
                        });

                        $(settings.navNextSelector).unbind(clickEvent).bind(clickEvent, function(e) {

                            if (e.type == 'touchstart') {
                                $(this).unbind('click.iosSliderEvent');
                            } else {
                                $(this).unbind('touchstart.iosSliderEvent');
                            }
                            clickEvent = e.type + '.iosSliderEvent';

                            var slide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;

                            if ((slide < childrenOffsets.length - 1) || settings.infiniteSlider) {
                                helpers.changeSlide(slide + 1, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
                            }
                        });

                    }

                    if (settings.autoSlide && !shortContent) {

                        if (settings.autoSlideToggleSelector != '') {

                            $(settings.autoSlideToggleSelector).css({
                                cursor: 'pointer'
                            });

                            $(settings.autoSlideToggleSelector).unbind(clickEvent).bind(clickEvent, function() {

                                if (e.type == 'touchstart') {
                                    $(this).unbind('click.iosSliderEvent');
                                } else {
                                    $(this).unbind('touchstart.iosSliderEvent');
                                }
                                clickEvent = e.type + '.iosSliderEvent';

                                if (!isAutoSlideToggleOn) {

                                    helpers.autoSlidePause(sliderNumber);
                                    isAutoSlideToggleOn = true;

                                    $(settings.autoSlideToggleSelector).addClass('on');

                                } else {

                                    helpers.autoSlide(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);

                                    isAutoSlideToggleOn = false;

                                    $(settings.autoSlideToggleSelector).removeClass('on');

                                }

                            });

                        }

                        if (!isAutoSlideToggleOn && !shortContent) {
                            helpers.autoSlide(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
                        }

                        $(stageNode).bind('mouseenter.iosSliderEvent', function() {
                            helpers.autoSlidePause(sliderNumber);
                        });

                        $(stageNode).bind('mouseleave.iosSliderEvent', function() {

                            if (!isAutoSlideToggleOn && !shortContent) {
                                helpers.autoSlide(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
                            }

                        });

                        $(stageNode).bind('touchend.iosSliderEvent', function() {

                            if (!isAutoSlideToggleOn && !shortContent) {
                                helpers.autoSlide(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
                            }

                        });

                    }

                    $(stageNode).data('iosslider', {
                        obj: $this,
                        settings: settings,
                        scrollerNode: scrollerNode,
                        slideNodes: slideNodes,
                        numberOfSlides: numberOfSlides,
                        centeredSlideOffset: centeredSlideOffset,
                        sliderNumber: sliderNumber,
                        originalOffsets: originalOffsets,
                        childrenOffsets: childrenOffsets,
                        sliderMax: sliderMax[sliderNumber],
                        scrollbarClass: scrollbarClass,
                        scrollbarWidth: scrollbarWidth,
                        scrollbarStageWidth: scrollbarStageWidth,
                        stageWidth: stageWidth,
                        scrollMargin: scrollMargin,
                        scrollBorder: scrollBorder,
                        infiniteSliderOffset: infiniteSliderOffset[sliderNumber],
                        infiniteSliderWidth: infiniteSliderWidth,
                        slideNodeOuterWidths: slideNodeOuterWidths
                    });

                    isFirstInit = false;

                    return true;

                }

                if (iosSliderSettings[sliderNumber].responsiveSlides || iosSliderSettings[sliderNumber].responsiveSlideContainer) {

                    var orientationEvent = supportsOrientationChange ? 'orientationchange' : 'resize';

                    $(window).bind(orientationEvent + '.iosSliderEvent', function() {

                        if (!init()) return true;

                        var args = $(stageNode).data('args');

                        if (settings.onSliderResize != '') {
                            settings.onSliderResize(args);
                        }

                    });

                }

                if ((settings.keyboardControls || settings.tabToAdvance) && !shortContent) {

                    $(document).bind('keydown.iosSliderEvent', function(e) {

                        if ((!isIe7) && (!isIe8)) {
                            var e = e.originalEvent;
                        }

                        if ((e.keyCode == 37) && settings.keyboardControls) {

                            e.preventDefault();

                            var slide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;

                            if ((slide > 0) || settings.infiniteSlider) {
                                helpers.changeSlide(slide - 1, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
                            }

                        } else if (((e.keyCode == 39) && settings.keyboardControls) || ((e.keyCode == 9) && settings.tabToAdvance)) {

                            e.preventDefault();

                            var slide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;

                            if ((slide < childrenOffsets.length - 1) || settings.infiniteSlider) {
                                helpers.changeSlide(slide + 1, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
                            }

                        }

                    });

                }

                if (isTouch || settings.desktopClickDrag) {

                    var touchStartFlag = false;
                    var touchSelection = $(scrollerNode);
                    var touchSelectionMove = $(scrollerNode);
                    var preventDefault = null;
                    var isUnselectable = false;

                    if (settings.scrollbarDrag) {

                        touchSelection = touchSelection.add(scrollbarNode);
                        touchSelectionMove = touchSelectionMove.add(scrollbarBlockNode);

                    }

                    $(touchSelection).bind('mousedown.iosSliderEvent touchstart.iosSliderEvent', function(e) {

                        if (touchStartFlag) return true;
                        touchStartFlag = true;

                        if (e.type == 'touchstart') {
                            $(touchSelectionMove).unbind('mousedown.iosSliderEvent');
                        } else {
                            $(touchSelectionMove).unbind('touchstart.iosSliderEvent');
                        }

                        if (touchLocks[sliderNumber] || shortContent) return true;

                        isUnselectable = helpers.isUnselectable(e.target, settings);

                        if (isUnselectable) return true;

                        currentEventNode = ($(this)[0] === $(scrollbarNode)[0]) ? scrollbarNode : scrollerNode;

                        if ((!isIe7) && (!isIe8)) {
                            var e = e.originalEvent;
                        }

                        helpers.autoSlidePause(sliderNumber);

                        allScrollerNodeChildren.unbind('.disableClick');

                        if (e.type == 'touchstart') {

                            eventX = e.touches[0].pageX;
                            eventY = e.touches[0].pageY;

                        } else {

                            if (window.getSelection) {
                                if (window.getSelection().empty) {
                                    window.getSelection().empty();
                                } else if (window.getSelection().removeAllRanges) {
                                    window.getSelection().removeAllRanges();
                                }
                            } else if (document.selection) {
                                document.selection.empty();
                            }

                            eventX = e.pageX;
                            eventY = e.pageY;

                            isMouseDown = true;
                            currentSlider = scrollerNode;

                            $(this).css({
                                cursor: grabInCursor
                            });

                        }

                        xCurrentScrollRate = new Array(0, 0);
                        yCurrentScrollRate = new Array(0, 0);
                        xScrollDistance = 0;
                        xScrollStarted = false;

                        for (var j = 0; j < scrollTimeouts.length; j++) {
                            clearTimeout(scrollTimeouts[j]);
                        }

                        var scrollPosition = helpers.getSliderOffset(scrollerNode, 'x');

                        if (scrollPosition > (sliderMin[sliderNumber] * -1 + centeredSlideOffset + scrollerWidth)) {

                            scrollPosition = sliderMin[sliderNumber] * -1 + centeredSlideOffset + scrollerWidth;

                            helpers.setSliderOffset($('.' + scrollbarClass), scrollPosition);

                            $('.' + scrollbarClass).css({
                                width: (scrollbarWidth - scrollBorder) + 'px'
                            });

                        } else if (scrollPosition < (sliderMax[sliderNumber] * -1)) {

                            scrollPosition = sliderMax[sliderNumber] * -1;

                            helpers.setSliderOffset($('.' + scrollbarClass), (scrollbarStageWidth - scrollMargin - scrollbarWidth));

                            $('.' + scrollbarClass).css({
                                width: (scrollbarWidth - scrollBorder) + 'px'
                            });

                        }

                        xCurrentScrollRate[1] = eventX;
                        yCurrentScrollRate[1] = eventY;

                        snapOverride = false;

                    });

                    $(touchSelectionMove).bind('touchmove.iosSliderEvent mousemove.iosSliderEvent', function(e) {

                        if (e.type == 'touchmove') {
                            $(touchSelectionMove).unbind('mousemove.iosSliderEvent');
                        } else {
                            $(touchSelectionMove).unbind('touchmove.iosSliderEvent');
                        }

                        if ((!isIe7) && (!isIe8)) {
                            var e = e.originalEvent;
                        }

                        if (touchLocks[sliderNumber] || shortContent) return true;

                        if (isUnselectable) return true;

                        var edgeDegradation = 0;

                        if (e.type == 'touchmove') {

                            eventX = e.touches[0].pageX;
                            eventY = e.touches[0].pageY;

                        } else {

                            if (window.getSelection) {
                                if (window.getSelection().empty) {
                                    window.getSelection().empty();
                                } else if (window.getSelection().removeAllRanges) {
                                    window.getSelection().removeAllRanges();
                                }
                            } else if (document.selection) {
                                document.selection.empty();
                            }

                            eventX = e.pageX;
                            eventY = e.pageY;

                            if (!isMouseDown) {
                                return true;
                            }

                            if (!isIe) {
                                if ((typeof e.webkitMovementX != 'undefined' || typeof e.webkitMovementY != 'undefined') && e.webkitMovementY === 0 && e.webkitMovementX === 0) {
                                    return true;
                                }
                            }

                        }

                        xCurrentScrollRate[0] = xCurrentScrollRate[1];
                        xCurrentScrollRate[1] = eventX;
                        xScrollDistance = (xCurrentScrollRate[1] - xCurrentScrollRate[0]) / 2;

                        yCurrentScrollRate[0] = yCurrentScrollRate[1];
                        yCurrentScrollRate[1] = eventY;
                        yScrollDistance = (yCurrentScrollRate[1] - yCurrentScrollRate[0]) / 2;

                        if (!xScrollStarted) {

                            var scrollbarSubtractor = ($(this)[0] === $(scrollbarNode)[0]) ? (sliderMin[sliderNumber]) : 0;
                            xScrollStartPosition = (helpers.getSliderOffset(this, 'x') - eventX - scrollbarSubtractor) * -1;
                            yScrollStartPosition = (helpers.getSliderOffset(this, 'y') - eventY) * -1;

                            var slide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;
                            var args = new helpers.args(settings, scrollerNode, $(scrollerNode).children(':eq(' + slide + ')'), slide, slide, false);
                            $(stageNode).data('args', args);

                            if (settings.onSlideStart != '') {
                                settings.onSlideStart(args);
                            }

                        }

                        if (((yScrollDistance > 3) || (yScrollDistance < -3)) && ((xScrollDistance < 3) && (xScrollDistance > -3)) && (e.type == 'touchmove') && (!xScrollStarted)) {
                            preventXScroll = true;
                        }

                        if (((xScrollDistance > 5) || (xScrollDistance < -5)) && (e.type == 'touchmove')) {

                            e.preventDefault();
                            xScrollStarted = true;

                        } else if (e.type != 'touchmove') {

                            xScrollStarted = true;

                        }

                        if (xScrollStarted && !preventXScroll) {

                            var scrollPosition = helpers.getSliderOffset(scrollerNode, 'x');
                            var scrollbarSubtractor = ($(this)[0] === $(scrollbarBlockNode)[0]) ? (sliderMin[sliderNumber]) : centeredSlideOffset;
                            var scrollbarMultiplier = ($(this)[0] === $(scrollbarBlockNode)[0]) ? ((sliderMin[sliderNumber] - sliderMax[sliderNumber] - centeredSlideOffset) / (scrollbarStageWidth - scrollMargin - scrollbarWidth)) : 1;
                            var elasticPullResistance = ($(this)[0] === $(scrollbarBlockNode)[0]) ? settings.scrollbarElasticPullResistance : settings.elasticPullResistance;
                            var snapCenteredSlideOffset = (settings.snapSlideCenter && ($(this)[0] === $(scrollbarBlockNode)[0])) ? 0 : centeredSlideOffset;
                            var snapCenteredSlideOffsetScrollbar = (settings.snapSlideCenter && ($(this)[0] === $(scrollbarBlockNode)[0])) ? centeredSlideOffset : 0;

                            if (e.type == 'touchmove') {
                                if (currentTouches != e.touches.length) {
                                    xScrollStartPosition = (scrollPosition * -1) + eventX;
                                }

                                currentTouches = e.touches.length;
                            }

                            if (settings.infiniteSlider) {

                                if (scrollPosition <= (sliderMax[sliderNumber] * -1)) {

                                    var scrollerWidth = $(scrollerNode).width();

                                    if (scrollPosition <= (sliderAbsMax[sliderNumber] * -1)) {

                                        var sum = originalOffsets[0] * -1;
                                        $(slideNodes).each(function(i) {

                                            helpers.setSliderOffset($(slideNodes)[i], sum + centeredSlideOffset);
                                            if (i < childrenOffsets.length) {
                                                childrenOffsets[i] = sum * -1;
                                            }
                                            sum = sum + slideNodeOuterWidths[i];

                                        });

                                        xScrollStartPosition = xScrollStartPosition - childrenOffsets[0] * -1;
                                        sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
                                        sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;
                                        infiniteSliderOffset[sliderNumber] = 0;

                                    } else {

                                        var lowSlideNumber = 0;
                                        var lowSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'x');
                                        $(slideNodes).each(function(i) {

                                            if (helpers.getSliderOffset(this, 'x') < lowSlideOffset) {
                                                lowSlideOffset = helpers.getSliderOffset(this, 'x');
                                                lowSlideNumber = i;
                                            }

                                        });

                                        var newOffset = sliderMin[sliderNumber] + scrollerWidth;
                                        helpers.setSliderOffset($(slideNodes)[lowSlideNumber], newOffset);

                                        sliderMin[sliderNumber] = childrenOffsets[1] * -1 + centeredSlideOffset;
                                        sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;

                                        childrenOffsets.splice(0, 1);
                                        childrenOffsets.splice(childrenOffsets.length, 0, newOffset * -1 + centeredSlideOffset);

                                        infiniteSliderOffset[sliderNumber]++;

                                    }

                                }

                                if ((scrollPosition >= (sliderMin[sliderNumber] * -1)) || (scrollPosition >= 0)) {

                                    var scrollerWidth = $(scrollerNode).width();

                                    if (scrollPosition >= 0) {

                                        var sum = originalOffsets[0] * -1;
                                        $(slideNodes).each(function(i) {

                                            helpers.setSliderOffset($(slideNodes)[i], sum + centeredSlideOffset);
                                            if (i < childrenOffsets.length) {
                                                childrenOffsets[i] = sum * -1;
                                            }
                                            sum = sum + slideNodeOuterWidths[i];

                                        });

                                        xScrollStartPosition = xScrollStartPosition + childrenOffsets[0] * -1;
                                        sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
                                        sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;
                                        infiniteSliderOffset[sliderNumber] = numberOfSlides;

                                        while (((childrenOffsets[0] * -1 - scrollerWidth + centeredSlideOffset) > 0)) {

                                            var highSlideNumber = 0;
                                            var highSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'x');
                                            $(slideNodes).each(function(i) {

                                                if (helpers.getSliderOffset(this, 'x') > highSlideOffset) {
                                                    highSlideOffset = helpers.getSliderOffset(this, 'x');
                                                    highSlideNumber = i;
                                                }

                                            });

                                            var newOffset = sliderMin[sliderNumber] - slideNodeOuterWidths[highSlideNumber];
                                            helpers.setSliderOffset($(slideNodes)[highSlideNumber], newOffset);

                                            childrenOffsets.splice(0, 0, newOffset * -1 + centeredSlideOffset);
                                            childrenOffsets.splice(childrenOffsets.length - 1, 1);

                                            sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
                                            sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;

                                            infiniteSliderOffset[sliderNumber]--;
                                            activeChildOffsets[sliderNumber]++;

                                        }

                                    } else {

                                        var highSlideNumber = 0;
                                        var highSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'x');
                                        $(slideNodes).each(function(i) {

                                            if (helpers.getSliderOffset(this, 'x') > highSlideOffset) {
                                                highSlideOffset = helpers.getSliderOffset(this, 'x');
                                                highSlideNumber = i;
                                            }

                                        });

                                        var newOffset = sliderMin[sliderNumber] - slideNodeOuterWidths[highSlideNumber];
                                        helpers.setSliderOffset($(slideNodes)[highSlideNumber], newOffset);

                                        childrenOffsets.splice(0, 0, newOffset * -1 + centeredSlideOffset);
                                        childrenOffsets.splice(childrenOffsets.length - 1, 1);

                                        sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
                                        sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;

                                        infiniteSliderOffset[sliderNumber]--;

                                    }

                                }

                            } else {

                                var scrollerWidth = $(scrollerNode).width();

                                if (scrollPosition > (sliderMin[sliderNumber] * -1 + centeredSlideOffset)) {

                                    edgeDegradation = (sliderMin[sliderNumber] + ((xScrollStartPosition - scrollbarSubtractor - eventX + snapCenteredSlideOffset) * -1 * scrollbarMultiplier) - scrollbarSubtractor) * elasticPullResistance * -1 / scrollbarMultiplier;

                                }

                                if (scrollPosition < (sliderMax[sliderNumber] * -1)) {

                                    edgeDegradation = (sliderMax[sliderNumber] + snapCenteredSlideOffsetScrollbar + ((xScrollStartPosition - scrollbarSubtractor - eventX) * -1 * scrollbarMultiplier) - scrollbarSubtractor) * elasticPullResistance * -1 / scrollbarMultiplier;

                                }

                            }

                            helpers.setSliderOffset(scrollerNode, ((xScrollStartPosition - scrollbarSubtractor - eventX - edgeDegradation) * -1 * scrollbarMultiplier) - scrollbarSubtractor + snapCenteredSlideOffsetScrollbar);

                            if (settings.scrollbar) {

                                helpers.showScrollbar(settings, scrollbarClass);

                                scrollbarDistance = Math.floor((xScrollStartPosition - eventX - edgeDegradation - sliderMin[sliderNumber] + snapCenteredSlideOffset) / (sliderMax[sliderNumber] - sliderMin[sliderNumber] + centeredSlideOffset) * (scrollbarStageWidth - scrollMargin - scrollbarWidth) * scrollbarMultiplier);

                                var width = scrollbarWidth;

                                if (scrollPosition >= (sliderMin[sliderNumber] * -1 + snapCenteredSlideOffset + scrollerWidth)) {

                                    width = scrollbarWidth - scrollBorder - (scrollbarDistance * -1);

                                    helpers.setSliderOffset($('.' + scrollbarClass), 0);

                                    $('.' + scrollbarClass).css({
                                        width: width + 'px'
                                    });

                                } else if (scrollPosition <= ((sliderMax[sliderNumber] * -1) + 1)) {

                                    width = scrollbarStageWidth - scrollMargin - scrollBorder - scrollbarDistance;

                                    helpers.setSliderOffset($('.' + scrollbarClass), scrollbarDistance);

                                    $('.' + scrollbarClass).css({
                                        width: width + 'px'
                                    });

                                } else {

                                    helpers.setSliderOffset($('.' + scrollbarClass), scrollbarDistance);

                                }

                            }

                            if (e.type == 'touchmove') {
                                lastTouch = e.touches[0].pageX;
                            }

                            var slideChanged = false;
                            var newChildOffset = helpers.calcActiveOffset(settings, (xScrollStartPosition - eventX - edgeDegradation) * -1, childrenOffsets, stageWidth, infiniteSliderOffset[sliderNumber], numberOfSlides, undefined, sliderNumber);
                            var tempOffset = (newChildOffset + infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;

                            if (settings.infiniteSlider) {

                                if (tempOffset != activeChildInfOffsets[sliderNumber]) {
                                    slideChanged = true;
                                }

                            } else {

                                if (newChildOffset != activeChildOffsets[sliderNumber]) {
                                    slideChanged = true;
                                }

                            }

                            if (slideChanged) {

                                activeChildOffsets[sliderNumber] = newChildOffset;
                                activeChildInfOffsets[sliderNumber] = tempOffset;
                                snapOverride = true;

                                var args = new helpers.args(settings, scrollerNode, $(scrollerNode).children(':eq(' + tempOffset + ')'), tempOffset, tempOffset, true);
                                $(stageNode).data('args', args);

                                if (settings.onSlideChange != '') {
                                    settings.onSlideChange(args);
                                }

                            }

                        }

                        touchStartFlag = false;

                    });

                    var eventObject = $(window);

                    if (isIe8 || isIe7) {
                        var eventObject = $(document);
                    }

                    $(touchSelection).bind('touchend.iosSliderEvent', function(e) {

                        $(eventObject).unbind('mouseup.iosSliderEvent' + sliderNumber);

                        var e = e.originalEvent;

                        if (touchLocks[sliderNumber] || shortContent) return true;

                        if (isUnselectable) return true;

                        if (e.touches.length != 0) {

                            for (var j = 0; j < e.touches.length; j++) {

                                if (e.touches[j].pageX == lastTouch) {
                                    helpers.slowScrollHorizontal(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, xScrollDistance, yScrollDistance, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, currentEventNode, snapOverride, centeredSlideOffset, settings);
                                }

                            }

                        } else {

                            helpers.slowScrollHorizontal(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, xScrollDistance, yScrollDistance, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, currentEventNode, snapOverride, centeredSlideOffset, settings);

                        }

                        preventXScroll = false;
                        touchStartFlag = false;

                    });

                    $(eventObject).bind('mouseup.iosSliderEvent' + sliderNumber, function(e) {

                        $(touchSelection).unbind('touchend.iosSliderEvent');

                        if (xScrollStarted) {
                            anchorEvents.unbind('click.disableClick').bind('click.disableClick', helpers.preventClick);
                        } else {
                            anchorEvents.unbind('click.disableClick').bind('click.disableClick', helpers.enableClick);
                        }

                        onclickEvents.each(function() {

                            this.onclick = function(event) {
                                if (xScrollStarted) {
                                    return false;
                                }

                                $(this).data('onclick').call(this, event || window.event);
                            }

                        });

                        if (parseFloat($().jquery) >= 1.8) {

                            allScrollerNodeChildren.each(function() {

                                var clickObject = $._data(this, 'events');

                                if (clickObject != undefined) {
                                    if (clickObject.click != undefined) {

                                        if (clickObject.click[0].namespace != 'iosSliderEvent') {

                                            if (!xScrollStarted) {
                                                return false;
                                            }

                                            $(this).one('click.disableClick', helpers.preventClick);
                                            var handlers = $._data(this, 'events').click;
                                            var handler = handlers.pop();
                                            handlers.splice(0, 0, handler);

                                        }

                                    }
                                }

                            });

                        } else if (parseFloat($().jquery) >= 1.6) {

                            allScrollerNodeChildren.each(function() {

                                var clickObject = $(this).data('events');

                                if (clickObject != undefined) {
                                    if (clickObject.click != undefined) {

                                        if (clickObject.click[0].namespace != 'iosSliderEvent') {

                                            if (!xScrollStarted) {
                                                return false;
                                            }

                                            $(this).one('click.disableClick', helpers.preventClick);
                                            var handlers = $(this).data('events').click;
                                            var handler = handlers.pop();
                                            handlers.splice(0, 0, handler);

                                        }

                                    }
                                }

                            });

                        } else {}

                        if (!isEventCleared[sliderNumber]) {

                            if (shortContent) return true;

                            $(touchSelection).css({
                                cursor: grabOutCursor
                            });

                            isMouseDown = false;

                            if (currentSlider == undefined) {
                                return true;
                            }

                            helpers.slowScrollHorizontal(currentSlider, slideNodes, scrollTimeouts, scrollbarClass, xScrollDistance, yScrollDistance, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, slideNodeOuterWidths, sliderNumber, infiniteSliderWidth, numberOfSlides, currentEventNode, snapOverride, centeredSlideOffset, settings);

                            currentSlider = undefined;

                        }

                        preventXScroll = false;
                        touchStartFlag = false;

                    });

                }

            });

        },

        destroy: function(clearStyle, node) {

            if (node == undefined) {
                node = this;
            }

            return $(node).each(function() {

                var $this = $(this);
                var data = $this.data('iosslider');
                if (data == undefined) return false;

                if (clearStyle == undefined) {
                    clearStyle = true;
                }

                helpers.autoSlidePause(data.sliderNumber);
                isEventCleared[data.sliderNumber] = true;
                $(window).unbind('.iosSliderEvent-' + data.sliderNumber);
                $(window).unbind('.iosSliderEvent');
                $(document).unbind('.iosSliderEvent-' + data.sliderNumber);
                $(document).unbind('keydown.iosSliderEvent');
                $(this).unbind('.iosSliderEvent');
                $(this).children(':first-child').unbind('.iosSliderEvent');
                $(this).children(':first-child').children().unbind('.iosSliderEvent');

                if (clearStyle) {
                    $(this).attr('style', '');
                    $(this).children(':first-child').attr('style', '');
                    $(this).children(':first-child').children().attr('style', '');

                    $(data.settings.navSlideSelector).attr('style', '');
                    $(data.settings.navPrevSelector).attr('style', '');
                    $(data.settings.navNextSelector).attr('style', '');
                    $(data.settings.autoSlideToggleSelector).attr('style', '');
                    $(data.settings.unselectableSelector).attr('style', '');
                }

                if (data.settings.scrollbar) {
                    $('.scrollbarBlock' + data.sliderNumber).remove();
                }

                var scrollTimeouts = slideTimeouts[data.sliderNumber];

                for (var i = 0; i < scrollTimeouts.length; i++) {
                    clearTimeout(scrollTimeouts[i]);
                }

                $this.removeData('iosslider');
                $this.removeData('args');

            });

        },

        update: function(node) {

            if (node == undefined) {
                node = this;
            }

            return $(node).each(function() {

                var $this = $(this);
                var data = $this.data('iosslider');
                if (data == undefined) return false;

                data.settings.startAtSlide = $this.data('args').currentSlideNumber;
                methods.destroy(false, this);

                if ((data.numberOfSlides != 1) && data.settings.infiniteSlider) {
                    data.settings.startAtSlide = (activeChildOffsets[data.sliderNumber] + 1 + infiniteSliderOffset[data.sliderNumber] + data.numberOfSlides) % data.numberOfSlides;
                }

                methods.init(data.settings, this);

                var args = new helpers.args(data.settings, data.scrollerNode, $(data.scrollerNode).children(':eq(' + (data.settings.startAtSlide - 1) + ')'), data.settings.startAtSlide - 1, data.settings.startAtSlide - 1, false);
                $(data.stageNode).data('args', args);

                if (data.settings.onSliderUpdate != '') {
                    data.settings.onSliderUpdate(args);
                }

            });

        },

        addSlide: function(slideNode, slidePosition) {

            return this.each(function() {

                var $this = $(this);
                var data = $this.data('iosslider');
                if (data == undefined) return false;

                if ($(data.scrollerNode).children().size() == 0) {

                    $(data.scrollerNode).append(slideNode);
                    $this.data('args').currentSlideNumber = 1;

                } else if (!data.settings.infiniteSlider) {

                    if (slidePosition <= data.numberOfSlides) {
                        $(data.scrollerNode).children(':eq(' + (slidePosition - 1) + ')').before(slideNode);
                    } else {
                        $(data.scrollerNode).children(':eq(' + (slidePosition - 2) + ')').after(slideNode);
                    }

                    if ($this.data('args').currentSlideNumber >= slidePosition) {
                        $this.data('args').currentSlideNumber++;
                    }

                } else {

                    if (slidePosition == 1) {
                        $(data.scrollerNode).children(':eq(0)').before(slideNode);
                    } else {
                        $(data.scrollerNode).children(':eq(' + (slidePosition - 2) + ')').after(slideNode);
                    }

                    if ((infiniteSliderOffset[data.sliderNumber] < -1) && (true)) {
                        activeChildOffsets[data.sliderNumber]--;
                    }

                    if ($this.data('args').currentSlideNumber >= slidePosition) {
                        activeChildOffsets[data.sliderNumber]++;
                    }

                }

                $this.data('iosslider').numberOfSlides++;

                methods.update(this);

            });

        },

        removeSlide: function(slideNumber) {

            return this.each(function() {

                var $this = $(this);
                var data = $this.data('iosslider');
                if (data == undefined) return false;

                $(data.scrollerNode).children(':eq(' + (slideNumber - 1) + ')').remove();
                if (activeChildOffsets[data.sliderNumber] > (slideNumber - 1)) {
                    activeChildOffsets[data.sliderNumber]--;
                }

                methods.update(this);

            });

        },

        goToSlide: function(slide, node) {

            if (node == undefined) {
                node = this;
            }

            return $(node).each(function() {

                var $this = $(this);
                var data = $this.data('iosslider');
                if (data == undefined) return false;

                slide = (slide > data.childrenOffsets.length) ? data.childrenOffsets.length - 1 : slide - 1;

                helpers.changeSlide(slide, $(data.scrollerNode), $(data.slideNodes), slideTimeouts[data.sliderNumber], data.scrollbarClass, data.scrollbarWidth, data.stageWidth, data.scrollbarStageWidth, data.scrollMargin, data.scrollBorder, data.originalOffsets, data.childrenOffsets, data.slideNodeOuterWidths, data.sliderNumber, data.infiniteSliderWidth, data.numberOfSlides, data.centeredSlideOffset, data.settings);

                activeChildOffsets[data.sliderNumber] = slide;

            });

        },

        lock: function() {

            return this.each(function() {

                var $this = $(this);
                var data = $this.data('iosslider');
                if (data == undefined) return false;

                touchLocks[data.sliderNumber] = true;

            });

        },

        unlock: function() {

            return this.each(function() {

                var $this = $(this);
                var data = $this.data('iosslider');
                if (data == undefined) return false;

                touchLocks[data.sliderNumber] = false;

            });

        },

        getData: function() {

            return this.each(function() {

                var $this = $(this);
                var data = $this.data('iosslider');
                if (data == undefined) return false;

                return data;

            });

        }

        /*autoSlide: function(boolean) {

			helpers.autoSlidePause(data.sliderNumber);

		},

		autoSlidePlay: function() {

			helpers.autoSlide($(data.scrollerNode), $(data.slideNodes), slideTimeouts[data.sliderNumber], data.scrollbarClass, data.scrollbarWidth, data.stageWidth, data.scrollbarStageWidth, data.scrollMargin, data.scrollBorder, data.originalOffsets, data.childrenOffsets, data.slideNodeOuterWidths, data.sliderNumber, data.infiniteSliderWidth, data.numberOfSlides, data.centeredSlideOffset, data.settings);

		}*/

    }

    /* public functions */
    $.fn.iosSlider = function(method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('invalid method call!');
        }

    };

})(jQuery);
/*jslint browser:true, node:true*/
/*global define, Event, Node*/


/**
 * Instantiate fast-clicking listeners on the specificed layer.
 *
 * @constructor
 * @param {Element} layer The layer to listen on
 */
function FastClick(layer) {
	'use strict';
	var oldOnClick, self = this;


	/**
	 * Whether a click is currently being tracked.
	 *
	 * @type boolean
	 */
	this.trackingClick = false;


	/**
	 * Timestamp for when when click tracking started.
	 *
	 * @type number
	 */
	this.trackingClickStart = 0;


	/**
	 * The element being tracked for a click.
	 *
	 * @type EventTarget
	 */
	this.targetElement = null;


	/**
	 * X-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartX = 0;


	/**
	 * Y-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartY = 0;


	/**
	 * ID of the last touch, retrieved from Touch.identifier.
	 *
	 * @type number
	 */
	this.lastTouchIdentifier = 0;


	/**
	 * The FastClick layer.
	 *
	 * @type Element
	 */
	this.layer = layer;

	if (!layer || !layer.nodeType) {
		throw new TypeError('Layer must be a document node');
	}

	/** @type function() */
	this.onClick = function() { return FastClick.prototype.onClick.apply(self, arguments); };

	/** @type function() */
	this.onMouse = function() { return FastClick.prototype.onMouse.apply(self, arguments); };

	/** @type function() */
	this.onTouchStart = function() { return FastClick.prototype.onTouchStart.apply(self, arguments); };

	/** @type function() */
	this.onTouchEnd = function() { return FastClick.prototype.onTouchEnd.apply(self, arguments); };

	/** @type function() */
	this.onTouchCancel = function() { return FastClick.prototype.onTouchCancel.apply(self, arguments); };

	if (FastClick.notNeeded()) {
		return;
	}

	// Set up event handlers as required
	if (this.deviceIsAndroid) {
		layer.addEventListener('mouseover', this.onMouse, true);
		layer.addEventListener('mousedown', this.onMouse, true);
		layer.addEventListener('mouseup', this.onMouse, true);
	}

	layer.addEventListener('click', this.onClick, true);
	layer.addEventListener('touchstart', this.onTouchStart, false);
	layer.addEventListener('touchend', this.onTouchEnd, false);
	layer.addEventListener('touchcancel', this.onTouchCancel, false);

	// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
	// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
	// layer when they are cancelled.
	if (!Event.prototype.stopImmediatePropagation) {
		layer.removeEventListener = function(type, callback, capture) {
			var rmv = Node.prototype.removeEventListener;
			if (type === 'click') {
				rmv.call(layer, type, callback.hijacked || callback, capture);
			} else {
				rmv.call(layer, type, callback, capture);
			}
		};

		layer.addEventListener = function(type, callback, capture) {
			var adv = Node.prototype.addEventListener;
			if (type === 'click') {
				adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
					if (!event.propagationStopped) {
						callback(event);
					}
				}), capture);
			} else {
				adv.call(layer, type, callback, capture);
			}
		};
	}

	// If a handler is already declared in the element's onclick attribute, it will be fired before
	// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
	// adding it as listener.
	if (typeof layer.onclick === 'function') {

		// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
		// - the old one won't work if passed to addEventListener directly.
		oldOnClick = layer.onclick;
		layer.addEventListener('click', function(event) {
			oldOnClick(event);
		}, false);
		layer.onclick = null;
	}
}


/**
 * Android requires exceptions.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;


/**
 * iOS requires exceptions.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);


/**
 * iOS 4 requires an exception for select elements.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS4 = FastClick.prototype.deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


/**
 * iOS 6.0(+?) requires the target element to be manually derived
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOSWithBadTarget = FastClick.prototype.deviceIsIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);


/**
 * Determine whether a given element requires a native click.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element needs a native click
 */
FastClick.prototype.needsClick = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {

	// Don't send a synthetic click to disabled inputs (issue #62)
	case 'button':
	case 'select':
	case 'textarea':
		if (target.disabled) {
			return true;
		}

		break;
	case 'input':

		// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
		if ((this.deviceIsIOS && target.type === 'file') || target.disabled) {
			return true;
		}

		break;
	case 'label':
	case 'video':
		return true;
	}

	return (/\bneedsclick\b/).test(target.className);
};


/**
 * Determine whether a given element requires a call to focus to simulate click into element.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
 */
FastClick.prototype.needsFocus = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {
	case 'textarea':
	case 'select':
		return true;
	case 'input':
		switch (target.type) {
		case 'button':
		case 'checkbox':
		case 'file':
		case 'image':
		case 'radio':
		case 'submit':
			return false;
		}

		// No point in attempting to focus disabled inputs
		return !target.disabled && !target.readOnly;
	default:
		return (/\bneedsfocus\b/).test(target.className);
	}
};


/**
 * Send a click event to the specified element.
 *
 * @param {EventTarget|Element} targetElement
 * @param {Event} event
 */
FastClick.prototype.sendClick = function(targetElement, event) {
	'use strict';
	var clickEvent, touch;

	// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
	if (document.activeElement && document.activeElement !== targetElement) {
		document.activeElement.blur();
	}

	touch = event.changedTouches[0];

	// Synthesise a click event, with an extra attribute so it can be tracked
	clickEvent = document.createEvent('MouseEvents');
	clickEvent.initMouseEvent('click', true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
	clickEvent.forwardedTouchEvent = true;
	targetElement.dispatchEvent(clickEvent);
};


/**
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.focus = function(targetElement) {
	'use strict';
	var length;

	if (this.deviceIsIOS && targetElement.setSelectionRange) {
		length = targetElement.value.length;
		targetElement.setSelectionRange(length, length);
	} else {
		targetElement.focus();
	}
};


/**
 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
 *
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.updateScrollParent = function(targetElement) {
	'use strict';
	var scrollParent, parentElement;

	scrollParent = targetElement.fastClickScrollParent;

	// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
	// target element was moved to another parent.
	if (!scrollParent || !scrollParent.contains(targetElement)) {
		parentElement = targetElement;
		do {
			if (parentElement.scrollHeight > parentElement.offsetHeight) {
				scrollParent = parentElement;
				targetElement.fastClickScrollParent = parentElement;
				break;
			}

			parentElement = parentElement.parentElement;
		} while (parentElement);
	}

	// Always update the scroll top tracker if possible.
	if (scrollParent) {
		scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
	}
};


/**
 * @param {EventTarget} targetElement
 * @returns {Element|EventTarget}
 */
FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
	'use strict';

	// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
	if (eventTarget.nodeType === Node.TEXT_NODE) {
		return eventTarget.parentNode;
	}

	return eventTarget;
};


/**
 * On touch start, record the position and scroll offset.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchStart = function(event) {
	'use strict';
	var targetElement, touch, selection;

	targetElement = this.getTargetElementFromEventTarget(event.target);
	touch = event.targetTouches[0];

	if (this.deviceIsIOS) {

		// Only trusted events will deselect text on iOS (issue #49)
		selection = window.getSelection();
		if (selection.rangeCount && !selection.isCollapsed) {
			return true;
		}

		if (!this.deviceIsIOS4) {

			// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
			// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
			// with the same identifier as the touch event that previously triggered the click that triggered the alert.
			// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
			// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
			if (touch.identifier === this.lastTouchIdentifier) {
				event.preventDefault();
				return false;
			}

			this.lastTouchIdentifier = touch.identifier;

			// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
			// 1) the user does a fling scroll on the scrollable layer
			// 2) the user stops the fling scroll with another tap
			// then the event.target of the last 'touchend' event will be the element that was under the user's finger
			// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
			// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
			this.updateScrollParent(targetElement);
		}
	}

	this.trackingClick = true;
	this.trackingClickStart = event.timeStamp;
	this.targetElement = targetElement;

	this.touchStartX = touch.pageX;
	this.touchStartY = touch.pageY;

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < 200) {
		event.preventDefault();
	}

	return true;
};


/**
 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.touchHasMoved = function(event) {
	'use strict';
	var touch = event.changedTouches[0];

	if (Math.abs(touch.pageX - this.touchStartX) > 10 || Math.abs(touch.pageY - this.touchStartY) > 10) {
		return true;
	}

	return false;
};


/**
 * Attempt to find the labelled control for the given label element.
 *
 * @param {EventTarget|HTMLLabelElement} labelElement
 * @returns {Element|null}
 */
FastClick.prototype.findControl = function(labelElement) {
	'use strict';

	// Fast path for newer browsers supporting the HTML5 control attribute
	if (labelElement.control !== undefined) {
		return labelElement.control;
	}

	// All browsers under test that support touch events also support the HTML5 htmlFor attribute
	if (labelElement.htmlFor) {
		return document.getElementById(labelElement.htmlFor);
	}

	// If no for attribute exists, attempt to retrieve the first labellable descendant element
	// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
	return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
};


/**
 * On touch end, determine whether to send a click event at once.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchEnd = function(event) {
	'use strict';
	var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

	// If the touch has moved, cancel the click tracking
	if (this.touchHasMoved(event)) {
		this.trackingClick = false;
		this.targetElement = null;
	}

	if (!this.trackingClick) {
		return true;
	}

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < 200) {
		this.cancelNextClick = true;
		return true;
	}

	this.lastClickTime = event.timeStamp;

	trackingClickStart = this.trackingClickStart;
	this.trackingClick = false;
	this.trackingClickStart = 0;

	// On some iOS devices, the targetElement supplied with the event is invalid if the layer
	// is performing a transition or scroll, and has to be re-detected manually. Note that
	// for this to function correctly, it must be called *after* the event target is checked!
	// See issue #57; also filed as rdar://13048589 .
	if (this.deviceIsIOSWithBadTarget) {
		touch = event.changedTouches[0];
		targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset);
	}

	targetTagName = targetElement.tagName.toLowerCase();
	if (targetTagName === 'label') {
		forElement = this.findControl(targetElement);
		if (forElement) {
			this.focus(targetElement);
			if (this.deviceIsAndroid) {
				return false;
			}

			targetElement = forElement;
		}
	} else if (this.needsFocus(targetElement)) {

		// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
		// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
		if ((event.timeStamp - trackingClickStart) > 100 || (this.deviceIsIOS && window.top !== window && targetTagName === 'input')) {
			this.targetElement = null;
			return false;
		}

		this.focus(targetElement);

		// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
		if (!this.deviceIsIOS4 || targetTagName !== 'select') {
			this.targetElement = null;
			event.preventDefault();
		}

		return false;
	}

	if (this.deviceIsIOS && !this.deviceIsIOS4) {

		// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
		// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
		scrollParent = targetElement.fastClickScrollParent;
		if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
			return true;
		}
	}

	// Prevent the actual click from going though - unless the target node is marked as requiring
	// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
	if (!this.needsClick(targetElement)) {
		event.preventDefault();
		this.sendClick(targetElement, event);
	}

	return false;
};


/**
 * On touch cancel, stop tracking the click.
 *
 * @returns {void}
 */
FastClick.prototype.onTouchCancel = function() {
	'use strict';
	this.trackingClick = false;
	this.targetElement = null;
};


/**
 * Determine mouse events which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onMouse = function(event) {
	'use strict';

	// If a target element was never set (because a touch event was never fired) allow the event
	if (!this.targetElement) {
		return true;
	}

	if (event.forwardedTouchEvent) {
		return true;
	}

	// Programmatically generated events targeting a specific element should be permitted
	if (!event.cancelable) {
		return true;
	}

	// Derive and check the target element to see whether the mouse event needs to be permitted;
	// unless explicitly enabled, prevent non-touch click events from triggering actions,
	// to prevent ghost/doubleclicks.
	if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

		// Prevent any user-added listeners declared on FastClick element from being fired.
		if (event.stopImmediatePropagation) {
			event.stopImmediatePropagation();
		} else {

			// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
			event.propagationStopped = true;
		}

		// Cancel the event
		event.stopPropagation();
		event.preventDefault();

		return false;
	}

	// If the mouse event is permitted, return true for the action to go through.
	return true;
};


/**
 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
 * an actual click which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onClick = function(event) {
	'use strict';
	var permitted;

	// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
	if (this.trackingClick) {
		this.targetElement = null;
		this.trackingClick = false;
		return true;
	}

	// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
	if (event.target.type === 'submit' && event.detail === 0) {
		return true;
	}

	permitted = this.onMouse(event);

	// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
	if (!permitted) {
		this.targetElement = null;
	}

	// If clicks are permitted, return true for the action to go through.
	return permitted;
};


/**
 * Remove all FastClick's event listeners.
 *
 * @returns {void}
 */
FastClick.prototype.destroy = function() {
	'use strict';
	var layer = this.layer;

	if (this.deviceIsAndroid) {
		layer.removeEventListener('mouseover', this.onMouse, true);
		layer.removeEventListener('mousedown', this.onMouse, true);
		layer.removeEventListener('mouseup', this.onMouse, true);
	}

	layer.removeEventListener('click', this.onClick, true);
	layer.removeEventListener('touchstart', this.onTouchStart, false);
	layer.removeEventListener('touchend', this.onTouchEnd, false);
	layer.removeEventListener('touchcancel', this.onTouchCancel, false);
};


FastClick.notNeeded = function() {
	'use strict';
	var metaViewport;

	// Devices that don't support touch don't need FastClick
	if (typeof window.ontouchstart === 'undefined') {
		return true;
	}

	if ((/Chrome\/[0-9]+/).test(navigator.userAgent)) {

		// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
		if (FastClick.prototype.deviceIsAndroid) {
			metaViewport = document.querySelector('meta[name=viewport]');
			if (metaViewport && metaViewport.content.indexOf('user-scalable=no') !== -1) {
				return true;
			}

		// Chrome desktop doesn't need FastClick (issue #15)
		} else {
			return true;
		}
	}

	return false;
};


/**
 * Factory method for creating a FastClick object
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.attach = function(layer) {
	'use strict';
	return new FastClick(layer);
};


if (typeof define !== 'undefined' && define.amd) {

	// AMD. Register as an anonymous module.
	define(function() {
		'use strict';
		return FastClick;
	});
} else if (typeof module !== 'undefined' && module.exports) {
	module.exports = FastClick.attach;
	module.exports.FastClick = FastClick;
} else {
	window.FastClick = FastClick;
}
if(!window.SA){window.SA={};}SA.redirection_mobile=function(m){var c=function(y){var x=new Date();x.setTime(x.getTime()+y);return x;};var q=function(C){if(!C){return;}var x=document.location.search,D=x&&x.substring(1).split("&"),z=0,B=D.length;for(;z<B;z++){var y=D[z],A=y&&y.substring(0,y.indexOf("="));if(A===C){return y.substring(y.indexOf("=")+1,y.length);}}};var a=navigator.userAgent.toLowerCase(),s="false",f="true",w=m||{},r=w.noredirection_param||"noredirection",t=w.mobile_prefix||"m",o=w.mobile_url,d=w.mobile_scheme?w.mobile_scheme+":":document.location.protocol,p=document.location.host,i=q(r),j=o||(t+"."+(!!p.match(/^www\./i)?p.substring(4):p)),k=w.cookie_hours||1,g=w.keep_path||false,v=w.keep_query||false,h=w.tablet_url||j,b=!!(a.match(/(iPhone|iPod|blackberry|android 0.5|htc|lg|midp|mmp|mobile|nokia|opera mini|palm|pocket|psp|sgh|smartphone|symbian|treo mini|Playstation Portable|SonyEricsson|Samsung|MobileExplorer|PalmSource|Benq|Windows Phone|Windows Mobile|IEMobile|Windows CE|Nintendo Wii)/i));if(document.referrer.indexOf(j)>=0||i===f){if(window.sessionStorage){window.sessionStorage.setItem(r,f);}else{document.cookie=r+"="+f+";expires="+c(3600*1000*k).toUTCString();}}var u=(window.sessionStorage)?(window.sessionStorage.getItem(r)===f):false,l=document.cookie?(document.cookie.indexOf(r)>=0):false;if(!!(a.match(/(iPad|SCH-I800|xoom|kindle)/i))){var e=(w.tablet_redirection===f||!!w.tablet_url)?true:false;b=false;}if((e||b)&&!(l||u)){if(w.beforeredirection_callback){if(!w.beforeredirection_callback.call(this)){return;}}var n="";if(g){n+=document.location.pathname;}if(v){n+=document.location.search;}if(e){document.location.href=d+"//"+h+n;}else{if(b){document.location.href=d+"//"+j+n;}}}};

var hash_old = "";
var hash_interval = 50;


/*
*  Document Ready
*
*  @description		This simple interval function looks for a change in the hash and then fires an event
*  @date 			22/03/2011
*/

$(document).ready(function()
{
	
	setInterval(function(){
		
		if(window.location.hash != hash_old)
		{
			// set the hash_old
			hash_old = window.location.hash;
			
			// there is a new hash
			var segments = window.location.hash.replace('#!/',"");

			$(document).trigger('hash/has_changed', segments);
			
		}
		
	}, hash_interval);
	
	
});


/*
*  get_hash
*
*  @description		returns a url string after the #!/
*  @created			4/04/2012
*/

function get_hash()
{
	// vars
	var segments = window.location.hash.replace('#!/',"");
	
	if( segments.substr( segments.length-1 ) == "/" )
	{
		segments = segments.substr(0, segments.length-1);
	}

	return segments;
}


/*
*  get_hash_segments
*
*  @description		returns an array
*  @created			4/04/2012
*/

function get_hash_segments()
{
	// vars
	var segments = get_hash();
	
	if( segments == "" )
	{
		return false;
	}
	
	var array = segments.split('/');

	return array;
}


/*
*  get_hash_segment
*
*  @description		returns a value from the current hash. eg: if hash was "projects/3/foo/bar", get_hash_segment("projects") will equal 3
*  @created			4/04/2012
*/

function get_hash_segment( segment )
{
	// vars
	var segments = window.location.hash.replace('#!/',"");
	
	
	// if no segment, or no segment found
	if(!segment || segments.indexOf(segment) == -1)
	{
		return false;
	}
	
	
	// segment exists
	var regex = new RegExp("(" + segment + "/)([a-zA-Z0-9_-]*)", "gi");
	var param = regex.exec( segments );

	return param[2];
}


/*
*  update_hash
*
*  @description		updates the current window url with new hash info. This function either replaces the current key / value or adds it to the string
*  @created			4/04/2012
*/

function update_hash( key, value )
{
	
	// does key exist?
	var current_value = get_hash_segment( key );
	
	if(current_value)
	{
		var current_string = key + "/" + current_value;
		var new_string = key + "/" + value;
		
		window.location.hash = window.location.hash.replace(current_string, new_string);
	}
	else
	{
		var new_string = "";
		
		if( window.location.hash.indexOf("#!/") == -1 )
		{
			new_string += "#!/";
		}
		
		new_string += key + "/" + value + "/";
		window.location.hash = window.location.hash + new_string;
	}
}


/*
*  set_hash
*
*  @description		
*  @created			4/04/2012
*/

function set_hash( value )
{
	window.location.hash = "#!/" + value;
}
(function($) {

    /*
     *  Helpers
     *
     *  @description
     *  @created				17/04/2012
     */

    $.fn.exists = function() {
        return $(this).length > 0;
    };


    $.fn.reverse = function() {
        return this.pushStack(this.get().reverse(), arguments);
    };


    /*
     *  setup_forms
     *
     *  @description
     *  @created				10/05/2012
     */

    function setup_forms() {
        $('form').each(function() {

            var form = $(this);

            form.validate({
                highlight: function(element, errorClass, validClass) {
                    $(element).closest('.field').addClass('error');
                },
                unhighlight: function(element, errorClass, validClass) {
                    $(element).closest('.field').removeClass('error');
                }
            });
        });
    }


    /*
     *  Hash Change
     *
     *  @description			Routes functions based on hash change
     *  @created				27/04/2012
     */

    $(document).on('hash/has_changed', function() {

        // vars
        var hash = get_hash_segments();


        // section
        if (hash.length == 1) {

            // vars
            var id = '#' + hash[0];

            if (!$(id).exists()) return false;

            var scroll_y = $(id).offset().top;
            var minus = (id == '#folio') ? 50 : 35;


            // scroll
            $('body, html').stop().animate({
                'scrollTop': scroll_y - minus
            }, 500);

            return false;

        }

    });


    /*
     *  setup_nav
     *
     *  @description
     *  @created				10/05/2012
     */

    function setup_nav() {

        // elements
        var nav = $('#nav');
        var nav_ul = $('#nav ul');
        var fake_nav = $('#fake_nav');
        var nav_orig_y = nav.position().top;


        // vars
        var window_y = 0;
        var nav_ul_visible = false;

        nav.find('h3').stop().css({
            'opacity': '0'
        });

        $(window).scroll(function() {

            window_y = $(window).scrollTop();

            // fake nav
            if (window_y >= (nav_orig_y - 40)) {

                if (!nav_ul_visible) {
                    nav_ul_visible = true;

                    nav.find('h2').animate({
                        'margin-left': '95px',
                        'opacity': 0.5
                    }, 500, function() {
                        if (nav_ul_visible) {
                            nav.find('h3').animate({
                                'opacity': '1'
                            }, 500);
                        }
                    });

                    fake_nav.css({
                        'display': 'none'
                    });
                    nav_ul.animate({
                        'opacity': 1
                    }, 300);
                }
            } else if (window_y < (nav_orig_y - 40)) {

                if (nav_ul_visible) {
                    nav_ul_visible = false;

                    nav.find('h3').stop().animate({
                        'opacity': '0'
                    }, 300);
                    nav.find('h2').animate({
                        'margin-left': '0px',
                        'opacity': 1
                    }, 500);

                    fake_nav.css({
                        'display': 'block'
                    });
                    nav_ul.animate({
                        'opacity': 0
                    }, 300);
                }
            }

            // nav
            if (window_y >= nav_orig_y) {
                nav.css({
                    'position': 'fixed',
                    'top': 0
                });
            } else if (window_y < nav_orig_y) {
                nav.css({
                    'position': 'absolute',
                    'top': 'auto'
                });
            }

            // nav ul
            /*if(window_y < (nav_orig_y - 36))
			{
				nav_ul.css({'margin-top' : '-' + ((nav_orig_y - 36) - window_y) + 'px'});
			}*/


        }).trigger('scroll');


    }


    /*--------------------------------------------------------------------------------------------
     *
     *    setup_services
     *
     *--------------------------------------------------------------------------------------------*/

    function setup_services() {
        var service = $('#services');
        var is_animated = false;
        var mouse_out = false;

        if ($.browser.msie || isMobile) {
            return false;
        }

        service.find('.service').each(function() {

            $(this).hover(function() {

                $(this).find('.circle').stop().animate({
                    top: '5px',
                    left: '5px',
                    width: '310px',
                    height: '310px'
                }, 250);

                $(this).find('.circle .inner').stop().animate({
                    top: '-5px',
                    left: '-5px',
                    'background-color': '#d0d0d0'
                }, 250);


            }, function() {



                $(this).find('.circle').stop().animate({
                    top: '0px',
                    left: '0px',
                    width: '320px',
                    height: '320px'
                }, 250);

                $(this).find('.circle .inner').stop().animate({
                    top: '0px',
                    left: '0px',
                    'background-color': '#fff'
                }, 250);


            });
        });

        // rocket
        service.find('.service.last').hover(function() {

            mouse_out = false;

            $(this).find('.icon.deliver').each(function() {

                var rocket = $(this);

                if (!is_animated) {
                    is_animated = true;
                    $(this).removeClass('fall_down').addClass('lift_off');
                    setTimeout(function() {
                        is_animated = false;
                        if (mouse_out) {
                            is_animated = true;
                            rocket.removeClass('lift_off').addClass('fall_down');
                            setTimeout(function() {
                                is_animated = false;
                                rocket.removeClass('fall_down');
                            }, 1000);
                        } else {
                            rocket.addClass('in_sky').removeClass('lift_off');
                        }

                    }, 3000);
                }

            });

        }, function() {

            mouse_out = true;

            $(this).find('.icon.deliver').each(function() {

                var rocket = $(this);

                if (!is_animated && rocket.hasClass('in_sky')) {
                    is_animated = true;
                    rocket.removeClass('in_sky').addClass('fall_down');
                    setTimeout(function() {
                        is_animated = false;
                        rocket.removeClass('fall_down');
                    }, 1000);
                }


            });

        });
    }


    /*--------------------------------------------------------------------------------------------
     *
     *    Setup Folio
     *
     *--------------------------------------------------------------------------------------------*/

    function setup_folio() {
        // elements
        var folio = $('#folio');
        var folio_single = $('#folio_single');
        var folio_nav = $('#folio_nav');
        var ajax_response = $('#ajax_response');
        var folio_projects = $('#folio_projects');
        var temp_project = $('#temp_project');

        // vars
        var active = false;
        var scroll_nav = true;
        var project_1 = false;
        var project_2 = false;

        //events
        folio_projects.find('.project').hover(function() {
            $(this).find('img').stop().animate({
                opacity: 0
            }, 250);
        }, function() {
            $(this).find('img').stop().animate({
                opacity: 1
            }, 250);
        });

        // if no nav, it is a single page via google. No ajax stuff please.
        if (!folio_nav.exists()) {
            return false;
        }


        /*
         *  Hash Change
         *
         *  @description			Routes functions based on hash change
         *  @created				27/04/2012
         */

        $(document).on('hash/has_changed', function() {

            // vars
            var hash = get_hash_segments();


            // close
            if (!hash && active) {
                close_project();

                return false;
            }

            if (hash.length == 1 && hash[0] == "folio" && active) {
                close_project();

                return false;
            }


            // open
            if (hash.length == 2 && hash[0] == "projects") {
                var project = hash[1];
                var data = {
                    url: /projects-ajax/ + project
                };


                // add active to project
                folio_projects.find('.project.active').removeClass('active');
                folio_projects.find('.project[data-id="' + project + '"]').addClass('active').addClass('loading');

                setTimeout(function() {
                    load_project(data);
                }, 1000);


                return false;
            }

        });



        // load project
        function load_project(options) {

            // default options
            var defaults = {
                direction: 'left',
                url: "/folio-ajax/"
            };

            // default options can be overridden by incoming options
            options = $.extend(defaults, options);

            $.ajax({
                url: options.url,
                context: document.body,
                success: function(data) {

                    // remove loading from button
                    $('#folio_next, #folio_prev').removeClass('loading');

                    // new height
                    temp_project.html(data);
                    var call_limit = 0;

                    function slide_in_content() {

                        call_limit++;

                        $('body, html').animate({
                            'scrollTop': folio_single.position().top - 50
                        }, 500);

                        if (temp_project.height() < 100) {
                            // something has gone wrong!
                            if (call_limit < 10) {
                                setTimeout(function() {

                                    slide_in_content();

                                }, 100);
                            }
                            return false;
                        }

                        var new_height = temp_project.height() + 70; // +70 is the (inside) container padding of 35 + 35
                        new_height = temp_project.height() + 70;
                        new_height = temp_project.height() + 70;

                        folio_single.animate({
                            'height': new_height
                        }, 500);

                        if (active) {
                            project_1 = project_2;

                            project_2 = false;

                            project_1.addClass('last_active');

                            project_2 = $('<div class="project ' + options.direction + '"></div>');
                            project_2.html(data);

                            ajax_response.append(project_2);
                            project_2.animate({
                                'left': '0%'
                            }, 750, function() {
                                project_1.remove();
                            });

                        } else {
                            ajax_response.find('.project').remove();

                            project_2 = $('<div class="project"></div>');
                            project_2.html(data);

                            ajax_response.append(project_2);
                            project_2.css({
                                'left': '0%'
                            });

                            $('#folio_mask').animate({
                                'height': 'toggle'
                            }, 500);
                        }

                        folio_projects.find('.project.loading').removeClass('loading');
                        active = true;

                    }

                    setTimeout(function() {

                        slide_in_content();

                    }, 100);


                }
            });


        }

        // folio_close
        folio_nav.find('a#folio_close').hover(function() {

            $(this).find('.outer').stop().animate({
                marginTop: '-40px',
                marginLeft: '-40px',
                width: '81px',
                height: '81px'
            }, 250);

        }, function() {

            $(this).find('.outer').stop().animate({
                marginTop: '-35px',
                marginLeft: '-35px',
                width: '71px',
                height: '71px'
            }, 250);

        });

        // close project
        function close_project() {
            folio_projects.find('.project.active').removeClass('active');
            folio_projects.find('.project.loading').removeClass('loading');


            folio_single.animate({
                'height': 0
            }, 500, function() {
                active = false;
            });

            // hide all other sections
            $('#folio_mask').animate({
                'height': 'toggle'
            }, 500);

        }


        // folio_prev
        folio_nav.find('a#folio_prev').click(function() {

            // set loading
            $(this).addClass('loading');

            // find current project
            var active = folio_projects.find('.project.active');
            if (active.length == 0) active = folio_projects.find('.project:first');

            // find next project
            var prev = active.prev('.project').length ? active.prev('.project') : folio_projects.find('.project:last');

            // find next id (id matches the post slug)
            var id = prev.attr('data-id');
            update_hash('projects', id);

        }).hover(function() {

            $(this).find('.outer').stop().animate({
                marginTop: '-32px',
                marginLeft: '-32px',
                width: '65px',
                height: '65px'
            }, 250);

        }, function() {

            $(this).find('.outer').stop().animate({
                marginTop: '-35px',
                marginLeft: '-35px',
                width: '71px',
                height: '71px'
            }, 250);

        });

        // folio_next
        folio_nav.find('a#folio_next').click(function() {

            // set loading
            $(this).addClass('loading');

            // find current project
            var active = folio_projects.find('.project.active');
            if (active.length == 0) active = folio_projects.find('.project:last');

            // find next project
            var next = active.next('.project').length ? active.next('.project') : folio_projects.find('.project:first');

            // find next id (id matches the post slug)
            var id = next.attr('data-id');
            update_hash('projects', id);


        }).hover(function() {

            $(this).find('.outer').stop().animate({
                marginTop: '-32px',
                marginLeft: '-32px',
                width: '65px',
                height: '65px'
            }, 250);

        }, function() {

            $(this).find('.outer').stop().animate({
                marginTop: '-35px',
                marginLeft: '-35px',
                width: '71px',
                height: '71px'
            }, 250);

        });


        $(window).scroll(function() {

            if (!active) return false;

            var window_y = $(window).scrollTop(); // 50 is the height of nav
            var folio_y = folio_single.offset().top + folio_single.height();

            console.log("window_y : " + window_y + ", folio_y : " + folio_y, "folio_nav.outerHeight() : " + folio_nav.height());


            // folio_nav
            if (window_y >= (folio_y - folio_nav.outerHeight() - 50)) {
                // scroll is at the bottom of the project
                folio_nav.css({
                    'position': 'absolute',
                    'top': (folio_single.height() - folio_nav.outerHeight()) + 'px'
                });
            } else if (window_y >= (folio_single.position().top - 50)) {
                // scroll is somewhere in the middle of the project
                folio_nav.css({
                    'position': 'fixed',
                    'top': '50px'
                });
            } else {
                // scroll is at the top of the project
                folio_nav.css({
                    'position': 'absolute',
                    'top': '0px'
                });
            }

        });


    }

    /*--------------------------------------------------------------------------------------------
     *
     *   setup_clients
     *
     *--------------------------------------------------------------------------------------------*/

    function setup_clients() {
        var clients = $('#clients, #awards');

        clients.find('.client a, .award a').hover(function() {
            $(this).find('img').stop().animate({
                opacity: 0
            }, 250);
        }, function() {
            $(this).find('img').stop().animate({
                opacity: 1
            }, 250);
        });
    }



    /*--------------------------------------------------------------------------------------------
     *
     *    Setup Slider
     *
     *--------------------------------------------------------------------------------------------*/

    function setup_slider() {
        var div = $('#slider');
        var width = div.find('.mask').width();
        var i = 0;
        var i_max = div.find('.slide').length - 1;

        div.find('a#slider_next').click(function() {

            if (i >= i_max) return false;

            i++;

            div.find('.mask').animate({
                'scrollLeft': width * i
            }, 500);

            return false;
        });

        div.find('a#slider_next, a#slider_prev').hover(function() {

            $(this).find('.outer').stop().animate({
                marginTop: '-33px',
                marginLeft: '-33px',
                width: '66px',
                height: '66px'
            }, 250);

        }, function() {

            $(this).find('.outer').stop().animate({
                marginTop: '-36px',
                marginLeft: '-36px',
                width: '72px',
                height: '72px'
            }, 250);

        });


        div.find('a#slider_prev').click(function() {

            if (i <= 0) return false;

            i--;

            div.find('.mask').animate({
                'scrollLeft': width * i
            }, 500);

            return false;
        })

        // reset slider
        div.find('.mask').animate({
            'scrollLeft': 0
        }, 0);

    };


    /*--------------------------------------------------------------------------------------------
     *
     *   setup_get_started
     *
     *--------------------------------------------------------------------------------------------*/

    function setup_get_started() {
        var get_started = $('#get_started');
        getStartedForm = $('.getStartedForm');

        get_started.find('a.download').each(function() {

            $(this).hover(function() {

                $(this).find('.inner').stop().animate({
                    marginLeft: '-40px',
                    marginTop: '-40px',
                    width: '80px',
                    height: '80px'
                }, 250);

            }, function() {

                $(this).find('.inner').stop().animate({
                    marginLeft: '-35px',
                    marginTop: '-35px',
                    width: '70px',
                    height: '70px'
                }, 250);

            });

        });

        // ON DOWNLOAD BUTTON CLICK
        get_started.find('a.download').on('click', function(e) {
            e.preventDefault();
            getStartedForm.toggleClass('show');
        });

        getStartedForm.find('.overlay').on('click', function(e) {
            e.preventDefault();
            getStartedForm.toggleClass('show');
            getStartedForm.find('.thankyou').remove();
            getStartedForm.find('input').val('');

        });

        // getStartedForm.find('button').on('click', function(e) {
        // 	e.preventDefault();
        // 	var $target = $(this),
        // 		url = getStartedForm.find('form').attr('action');
        // 	$.ajax({
        // 		type: "POST",
        // 		url: url,
        // 		dataType: 'json',
        // 		success: function(){
        // 			var downloadURL = $target.attr('data-file');
        // 			alert('YEP');

        // 		}
        // 	});
        // });

        getStartedForm.find('form').submit(function(e) {
            e.preventDefault();
            var $target = $(this),
                downloadURL = $('button', this).attr('data-file');
            $.getJSON(
                this.action + "?callback=?",
                $(this).serialize(),
                function(data) {
                    if (data.Status === 400) {
                        alert(data.Message);
                    } else { // 200
                        //alert("Success: " + data.Message);
                        $target.find('.thankyou').remove();
                        $target.append("<p class='thankyou'>Thank you, your download has started.</p>");
                        window.location.href = downloadURL;
                    }
                });
        });

    }


    /*--------------------------------------------------------------------------------------------
     *
     *   setup_footer
     *
     *--------------------------------------------------------------------------------------------*/

    function setup_footer() {
        var footer = $('#footer');

        footer.find('.circle_button').each(function() {

            $(this).hover(function() {

                $(this).find('.outer').stop().animate({
                    marginLeft: '-30px',
                    marginTop: '-30px',
                    width: '60px',
                    height: '60px'
                }, 250);

            }, function() {

                $(this).find('.outer').stop().animate({
                    marginLeft: '-25px',
                    marginTop: '-25px',
                    width: '50px',
                    height: '50px'
                }, 250);

            });

        });

        // ajax subscribe
        $('#subForm').submit(function(e) {
            e.preventDefault();
            $(this).animate({
                opacity: 0.5
            }, 300);
            $.getJSON(
                this.action + "?callback=?",
                $(this).serialize(),
                function(data) {
                    if (data.Status === 400) {
                        alert(data.Message);
                        $('#subForm').animate({
                            opacity: 1
                        }, 300);
                    } else { // 200
                        $('#subForm input[type="text"]').val('Thank you');
                        $('#subForm').animate({
                            opacity: 1
                        }, 300);
                        //alert("Success: " + data.Message);
                    }
                });
        });


    }


    /*--------------------------------------------------------------------------------------------
     *
     *   MOBILE FOLIO
     *
     *--------------------------------------------------------------------------------------------*/

    function mobileFolio() {

        if (mobileCarouselInit) return false;

        mobileCarouselInit = true;

        var $mobileFolio = $('.mobileFolio'),
            $controls = $('.sliderControls');


        // MAKE CONTROLS
        $mobileFolio.find('.slide').each(function() {
            $controls.find('ul').append('<li>' + ($(this).index() + 1) + '</li>');
        });


        //SLIDE INFO CLICKS
        $mobileFolio.find('li').on('click', function() {
            $(this).find('.caption').toggleClass('show');

        });

        $mobileFolio.iosSlider({
            snapToChildren: true,
            scrollbar: false,
            startAtSlide: 1,
            autoSlide: false,
            scrollbarHide: true,
            desktopClickDrag: true,
            responsiveSlides: true,
            infiniteSlider: true,
            sliderCSS: {
                height: $('.slide:first-child img').height()
            },
            navSlideSelector: $controls.find('li'),
            onSliderLoaded: function() {
                $(window).resize();
            },
            onSlideChange: function(args) {
                $controls.find('.selected').removeClass('selected');
                $controls.find('li:eq(' + (args.currentSlideNumber - 1) + ')').addClass('selected');
            }
        });

    }

    function updateFolioHeight() {
        // SET FOLIO HEIGHT
        var $mobileFolio = $('.mobileFolio');
        // console.log($('.slide:first-child img').height());
        $mobileFolio.find('.slider').css('height', $mobileFolio.find('.slide:first-child img').height());
    }

    function positionAboutColumns() {
        $('#about .col_6 h3').each(function(i) {
            if (i == 1) {
                $(this).addClass('right');
            }
            $(this).append('<span class="marker"></span>');
        });
    }

    /*--------------------------------------------------------------------------------------------
     *
     *    GLOBAL VARS
     *
     *--------------------------------------------------------------------------------------------*/
    var isMobile = false;
    var mobileCarouselInit = false;

    /*--------------------------------------------------------------------------------------------
     *
     *    Document Ready
     *
     *--------------------------------------------------------------------------------------------*/

    $(document).ready(function() {
        // add hash to links
        $('a.add-hash').each(function() {

            var href = $(this).attr('href');
            $(this).attr('href', '/#!' + href);

        });

        // CHECK IF WINDOW IS SIZE OF MOBILE MEDIA QUERY
        var $w = $(window);
        $w.resize(function() {
            if ($w.width() <= 1000) {
                isMobile = true;

                // MOBILE SLIDER
                updateFolioHeight();
                mobileFolio();



                // KILL CIRCLE HOVER ANIMATIONS & ROCKET
                $('#services').find('.service').unbind('mouseenter mouseleave');
                $('#services').find('.service.last').unbind('mouseenter mouseleave');
            } else {
                isMobile = false;
                // RE INIT THE CIRCLE ANIMATIONS & ROCKET
                setup_services();
            }
        });


        // FAST CLICK
        // FastClick.attach(document.body);


        //set_widths();
        setup_nav();
        //setup_services();
        setup_folio();
        setup_clients();
        setup_slider();
        setup_get_started();
        setup_footer();
        positionAboutColumns();

    });


    /*--------------------------------------------------------------------------------------------
		Window load
	--------------------------------------------------------------------------------------------*/
    $(window).load(function() {
        $(window).resize();
    });

    /*
	window.onresize = function(event) {
		//set_widths();
	}

	function set_widths()
	{

		return false;

		$("#nav, #header, #footer, #header_top, #header .container").css({
			width: $(document).width()
		});

	}
	*/

})(jQuery);