/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    './component',
    '../flags/namespace',
    '../events/clickout',
    '../extensions/position-to',
    '../extensions/shown-selector'
], function($, Toolkit, namespace) {

Toolkit.Tooltip = Toolkit.CompositeComponent.extend({
    name: 'Tooltip',
    version: '2.0.0',

    /**
     * Initialize the tooltip.
     *
     * @param {jQuery} nodes
     * @param {Object} [options]
     */
    constructor: function(nodes, options) {
        this.nodes = $(nodes);
        options = this.setOptions(options);
        this.createWrapper();

        // Remove title attributes
        if (options.getTitle === 'title') {
            options.getTitle = 'data-' + this.keyName + '-title';

            this.nodes.each(function(i, node) {
                $(node).attr(options.getTitle, $(node).attr('title')).removeAttr('title');
            });
        }

        // Initialize events
        this.addEvent('{mode}', 'document', 'onShowToggle', '{selector}');

        if (options.mode === 'click') {
            this.addEvent('clickout', 'document', 'hide');
        } else {
            this.addEvent('mouseleave', 'document', 'hide', '{selector}');
        }

        this.initialize();
    },

    /**
     * Hide the tooltip.
     */
    hide: function() {
        this.fireEvent('hiding');

        this.hideElements();

        if (this.node) {
            this.node
                .removeAttr('aria-describedby')
                .removeClass('is-active');
        }

        this.fireEvent('hidden');
    },

    /**
     * Positions the tooltip relative to the current node or the mouse cursor.
     * Additionally will apply the title/content and hide/show if necessary.
     *
     * @param {String|jQuery} content
     * @param {String|jQuery} [title]
     */
    position: function(content, title) {
        if (content === true) {
            return; // AJAX is currently loading
        }

        this.fireEvent('showing');

        // Set the node state
        var node = this.node.aria('describedby', this.id());

        // Load runtime options
        var options = this.inheritOptions(this.options, node);

        // Load the element
        var element = this.loadElement(node);

        // Set the title and content
        title = title || this.readValue(node, options.getTitle);

        element
            .find(this.ns('header'))
                .html(title).toggle(Boolean(title) && options.showTitle)
            .end()
            .find(this.ns('content'))
                .html(content);

        this.fireEvent('load', [content, title]);

        // Follow the mouse
        if (options.follow) {
            var follow = this.onFollow.bind(this);

            node.off('mousemove', follow).on('mousemove', follow);

        // Position offset node
        } else {
            element.reveal().positionTo(options.position, node, {
                left: options.xOffset,
                top: options.yOffset
            });
        }

        this.fireEvent('shown');
    },

    /**
     * Show the tooltip and determine whether to grab the content from an AJAX call,
     * a DOM node, or plain text. The content can also be passed as an argument.
     *
     * @param {jQuery} node
     * @param {String|jQuery} [content]
     */
    show: function(node, content) {
        this.node = node = $(node).addClass('is-active');

        // Load the new element
        this.loadElement(node, function(tooltip) {
            tooltip
                .addClass(this.readOption(node, 'position'))
                .attr('role', 'tooltip');
        });

        // Load the content
        this.loadContent(content || this.readValue(node, this.readOption(node, 'getContent')));
    },

    /**
     * Event handler for positioning the tooltip by the mouse.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onFollow: function(e) {
        e.preventDefault();

        var options = this.options;

        this.element.reveal().positionTo(options.position, e, {
            left: options.xOffset,
            top: options.yOffset
        }, true);
    },

    /**
     * {@inheritdoc}
     */
    onRequestBefore: function(xhr) {
        Toolkit.Component.prototype.onRequestBefore.call(this, xhr);

        if (this.options.showLoading) {
            this.position(Toolkit.messages.loading);
        }
    }

}, {
    mode: 'hover',
    animation: 'fade',
    follow: false,
    position: 'top-center',
    showLoading: true,
    showTitle: true,
    getTitle: 'title',
    getContent: 'data-tooltip',
    mouseThrottle: 50,
    xOffset: 0,
    yOffset: 0,
    wrapperClass: namespace + 'tooltips',
    template: '<div class="' + namespace + 'tooltip">' +
        '<div class="' + namespace + 'tooltip-inner">' +
            '<div class="' + namespace + 'tooltip-head" data-tooltip-header></div>' +
            '<div class="' + namespace + 'tooltip-body" data-tooltip-content></div>' +
        '</div>' +
        '<div class="' + namespace + 'tooltip-arrow"></div>' +
    '</div>'
});

Toolkit.create('tooltip', function(options) {
    return new Toolkit.Tooltip(this, options);
}, true);

return Toolkit;
});
